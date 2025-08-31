const Post = require('../models/Post');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all posts with pagination and filtering
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { 
      search, 
      category, 
      tag, 
      author, 
      status = 'published',
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (status === 'published') {
      query.status = 'published';
      query.isPublished = true;
    } else if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.categories = { $in: [category.toLowerCase()] };
    }

    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    if (author) {
      const authorUser = await User.findOne({ username: author });
      if (authorUser) {
        query.author = authorUser._id;
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-content'); // Don't include full content in list

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    // Get categories and tags for filtering
    const categories = await Post.distinct('categories');
    const tags = await Post.distinct('tags');

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        categories,
        tags
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      message: 'Server error while fetching posts'
    });
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPost = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug, status: 'published', isPublished: true })
      .populate('author', 'username firstName lastName avatar bio')
      .populate('comments.user', 'username firstName lastName avatar');

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Increment view count
    await post.incrementViews();

    // Get related posts
    const relatedPosts = await Post.find({
      _id: { $ne: post._id },
      status: 'published',
      isPublished: true,
      $or: [
        { categories: { $in: post.categories } },
        { tags: { $in: post.tags } }
      ]
    })
      .populate('author', 'username firstName lastName avatar')
      .limit(3)
      .select('title slug excerpt featuredImage author createdAt');

    res.json({
      post,
      relatedPosts
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      message: 'Server error while fetching post'
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { 
      title, 
      content, 
      excerpt, 
      categories, 
      tags, 
      featuredImage,
      status = 'draft',
      seo
    } = req.body;

    // Create post
    const post = new Post({
      title,
      content,
      excerpt,
      categories: categories ? categories.map(cat => cat.toLowerCase()) : [],
      tags: tags ? tags.map(tag => tag.toLowerCase()) : [],
      featuredImage: featuredImage || '',
      status,
      author: req.user._id,
      seo: seo || {}
    });

    await post.save();

    // Add post to user's posts array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { posts: post._id } }
    );

    // Populate author info
    await post.populate('author', 'username firstName lastName avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A post with this title already exists'
      });
    }

    res.status(500).json({
      message: 'Server error while creating post'
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Owner or Admin)
const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { 
      title, 
      content, 
      excerpt, 
      categories, 
      tags, 
      featuredImage,
      status,
      seo
    } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Check ownership or admin status
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to update this post'
      });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (categories) post.categories = categories.map(cat => cat.toLowerCase());
    if (tags) post.tags = tags.map(tag => tag.toLowerCase());
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (status) post.status = status;
    if (seo) post.seo = { ...post.seo, ...seo };

    await post.save();

    // Populate author info
    await post.populate('author', 'username firstName lastName avatar');

    res.json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      message: 'Server error while updating post'
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Owner or Admin)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Check ownership or admin status
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to delete this post'
      });
    }

    // Remove post from user's posts array
    await User.findByIdAndUpdate(
      post.author,
      { $pull: { posts: post._id } }
    );

    await Post.findByIdAndDelete(id);

    res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      message: 'Server error while deleting post'
    });
  }
};

// @desc    Toggle post like
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    await post.toggleLike(req.user._id);

    res.json({
      message: 'Like toggled successfully',
      likes: post.likes,
      likeCount: post.likes.length
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      message: 'Server error while toggling like'
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    await post.addComment(req.user._id, content);

    // Populate comment user info
    await post.populate('comments.user', 'username firstName lastName avatar');

    res.json({
      message: 'Comment added successfully',
      comment: post.comments[post.comments.length - 1]
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      message: 'Server error while adding comment'
    });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:username
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const posts = await Post.find({
      author: user._id,
      status: 'published',
      isPublished: true
    })
      .populate('author', 'username firstName lastName avatar')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');

    const total = await Post.countDocuments({
      author: user._id,
      status: 'published',
      isPublished: true
    });

    res.json({
      posts,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        avatar: user.avatar,
        postCount: user.posts.length
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      message: 'Server error while fetching user posts'
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts
};
