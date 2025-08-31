import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { postService } from '../services/postService';
import { 
  FiArrowRight, 
  FiClock, 
  FiEye, 
  FiHeart, 
  FiMessageCircle,
  FiTrendingUp,
  FiBookOpen,
  FiUsers,
  FiStar
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('publishedAt');

  // Fetch posts
  const { data: postsData, isLoading, error } = useQuery(
    ['posts', selectedCategory, sortBy],
    () => postService.getPosts({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      sortBy,
      limit: 12
    }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    ['categories'],
    () => postService.getPosts({ limit: 1 }),
    {
      select: (data) => data.filters?.categories || [],
    }
  );

  const categories = categoriesData || [];
  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination;

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't load the posts. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Share Your Story with the World
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of writers and readers on our platform. Create, share, and discover amazing content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Start Writing
            </Link>
            <Link
              to="/search"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 text-lg font-semibold transition-colors duration-200"
            >
              Explore Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <FiBookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {pagination?.totalPosts || 0}+
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Blog Posts</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center mx-auto">
                <FiUsers className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">1000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Writers</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <FiTrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">50K+</h3>
              <p className="text-gray-600 dark:text-gray-400">Readers</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
                <FiStar className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">4.9</h3>
              <p className="text-gray-600 dark:text-gray-400">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories and Posts Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Explore by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`badge ${selectedCategory === 'all' ? 'badge-primary' : 'badge-secondary'} cursor-pointer hover:scale-105 transition-transform duration-200`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`badge ${selectedCategory === category ? 'badge-primary' : 'badge-secondary'} cursor-pointer hover:scale-105 transition-transform duration-200 capitalize`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Latest Posts
            </h3>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input w-auto"
            >
              <option value="publishedAt">Latest</option>
              <option value="views">Most Popular</option>
              <option value="likes">Most Liked</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedCategory === 'all' 
                  ? 'No posts have been published yet.' 
                  : `No posts found in the "${selectedCategory}" category.`
                }
              </p>
              <Link to="/create-post" className="btn-primary">
                Write the First Post
              </Link>
            </div>
          )}

          {/* Load More Button */}
          {pagination?.hasNext && (
            <div className="text-center mt-12">
              <Link
                to={`/search?category=${selectedCategory}&sort=${sortBy}`}
                className="btn-outline inline-flex items-center space-x-2"
              >
                <span>View All Posts</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your Blogging Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join our community of writers and share your knowledge, stories, and insights with readers around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary px-8 py-3 text-lg font-semibold"
            >
              Get Started Today
            </Link>
            <Link
              to="/search"
              className="btn-outline px-8 py-3 text-lg font-semibold"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className="card hover:shadow-lg transition-shadow duration-300 group">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="card-body">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="badge-secondary text-xs capitalize"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          <Link to={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <FiClock className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FiEye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <FiHeart className="w-4 h-4" />
              <span>{post.likes?.length || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FiMessageCircle className="w-4 h-4" />
              <span>{post.comments?.length || 0}</span>
            </span>
          </div>
        </div>

        {/* Author */}
        {post.author && (
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {post.author.firstName?.charAt(0) || post.author.username?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {post.author.firstName && post.author.lastName
                  ? `${post.author.firstName} ${post.author.lastName}`
                  : post.author.username
                }
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{post.author.username}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default Home;
