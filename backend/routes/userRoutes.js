const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @desc    Get public user profile
// @route   GET /api/users/:username
// @access  Public
const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select('username firstName lastName bio avatar createdAt')
      .populate('posts', 'title slug excerpt featuredImage status createdAt');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Filter only published posts
    const publishedPosts = user.posts.filter(post => 
      post.status === 'published'
    );

    res.json({
      user: {
        ...user.toObject(),
        posts: publishedPosts,
        postCount: publishedPosts.length
      }
    });

  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      message: 'Server error while fetching user profile'
    });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchQuery = {
      $text: { $search: query.trim() }
    };

    const users = await User.find(searchQuery)
      .select('username firstName lastName bio avatar')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(searchQuery);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      message: 'Server error while searching users'
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/users/me/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title slug excerpt featuredImage author createdAt')
      .select('favorites');

    res.json({
      favorites: user.favorites || []
    });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      message: 'Server error while fetching favorites'
    });
  }
};

// @desc    Add/Remove post from favorites
// @route   POST /api/users/me/favorites/:postId
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const { postId } = req.params;

    const user = await User.findById(req.user._id);
    const favoriteIndex = user.favorites.indexOf(postId);

    if (favoriteIndex > -1) {
      // Remove from favorites
      user.favorites.splice(favoriteIndex, 1);
      await user.save();
      
      res.json({
        message: 'Post removed from favorites',
        isFavorite: false
      });
    } else {
      // Add to favorites
      user.favorites.push(postId);
      await user.save();
      
      res.json({
        message: 'Post added to favorites',
        isFavorite: true
      });
    }

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      message: 'Server error while toggling favorite'
    });
  }
};

// @desc    Get user's drafts
// @route   GET /api/users/me/drafts
// @access  Private
const getDrafts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const drafts = await User.findById(req.user._id)
      .populate({
        path: 'posts',
        match: { status: 'draft' },
        options: {
          sort: { updatedAt: -1 },
          skip: skip,
          limit: parseInt(limit)
        },
        select: 'title slug excerpt featuredImage createdAt updatedAt'
      })
      .select('posts');

    const totalDrafts = await User.aggregate([
      { $match: { _id: req.user._id } },
      { $unwind: '$posts' },
      {
        $lookup: {
          from: 'posts',
          localField: 'posts',
          foreignField: '_id',
          as: 'post'
        }
      },
      { $match: { 'post.status': 'draft' } },
      { $count: 'total' }
    ]);

    const total = totalDrafts.length > 0 ? totalDrafts[0].total : 0;

    res.json({
      drafts: drafts.posts || [],
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDrafts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({
      message: 'Server error while fetching drafts'
    });
  }
};

// Routes
router.get('/search', searchUsers);
router.get('/:username', getPublicProfile);
router.get('/me/favorites', auth, getFavorites);
router.post('/me/favorites/:postId', auth, toggleFavorite);
router.get('/me/drafts', auth, getDrafts);

module.exports = router;
