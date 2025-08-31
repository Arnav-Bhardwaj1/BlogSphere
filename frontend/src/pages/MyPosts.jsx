import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call when backend is ready
      // const response = await postService.getMyPosts();
      // setPosts(response.data);
      
      // For now, read from localStorage (temporary solution)
      const storedPosts = JSON.parse(localStorage.getItem('blogsphere_posts') || '[]');
      
      if (storedPosts.length === 0) {
        // Show some sample posts if none exist
        const samplePosts = [
          {
            _id: '1',
            title: 'Getting Started with BlogSphere',
            slug: 'getting-started-with-blogsphere',
            excerpt: 'Learn how to create your first blog post on BlogSphere...',
            status: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            readTime: 5,
            views: 42
          },
          {
            _id: '2',
            title: 'Writing Great Content',
            slug: 'writing-great-content',
            excerpt: 'Tips and tricks for creating engaging blog content...',
            status: 'draft',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            readTime: 8,
            views: 0
          }
        ];
        
        setPosts(samplePosts);
      } else {
        setPosts(storedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load your posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // await postService.deletePost(postId);
        
        // Remove from localStorage
        const storedPosts = JSON.parse(localStorage.getItem('blogsphere_posts') || '[]');
        const updatedPosts = storedPosts.filter(post => post._id !== postId);
        localStorage.setItem('blogsphere_posts', JSON.stringify(updatedPosts));
        
        // Update state
        setPosts(posts.filter(post => post._id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and track your blog posts
              </p>
            </div>
            
            <Link
              to="/create-post"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Create New Post
            </Link>
          </div>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
            <div className="mx-auto h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
              <FiFileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start writing your first blog post to share your ideas with the world.
            </p>
            <Link
              to="/create-post"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {posts.length} Post{posts.length !== 1 ? 's' : ''}
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <div key={post._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {post.title}
                        </h3>
                        {getStatusBadge(post.status)}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                        <span>•</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/posts/${post.slug}`}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                        title="View Post"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        to={`/edit-post/${post._id}`}
                        className="p-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
                        title="Edit Post"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200"
                        title="Delete Post"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
