import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiMapPin, FiLink, FiArrowLeft } from 'react-icons/fi';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    // TODO: Fetch user data and posts by username
    // For now, using mock data
    setTimeout(() => {
      setUser({
        id: 1,
        username: 'johndoe',
        displayName: 'John Doe',
        email: 'john@example.com',
        bio: 'Full-stack developer passionate about creating amazing web experiences. I love working with React, Node.js, and modern web technologies.',
        avatar: null,
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        joinedAt: '2023-01-15',
        postCount: 12,
        followerCount: 45,
        followingCount: 23
      });
      
      setPosts([
        {
          id: 1,
          title: 'Getting Started with React Hooks',
          excerpt: 'Learn how to use React Hooks to manage state and side effects in functional components...',
          slug: 'getting-started-with-react-hooks',
          createdAt: '2024-01-10',
          readTime: '5 min read'
        },
        {
          id: 2,
          title: 'Building a REST API with Node.js',
          excerpt: 'A comprehensive guide to building scalable REST APIs using Node.js and Express...',
          slug: 'building-rest-api-nodejs',
          createdAt: '2024-01-05',
          readTime: '8 min read'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              User Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The user you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-500"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* User profile header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.displayName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                @{user.username}
              </p>
              
              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {user.bio}
                </p>
              )}

              {/* User stats */}
              <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Joined {new Date(user.joinedAt).toLocaleDateString()}
                </div>
                {user.location && (
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center">
                    <FiLink className="w-4 h-4 mr-2" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              {/* Follow stats */}
              <div className="flex space-x-6 mt-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.postCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Posts
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.followerCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Followers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.followingCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Following
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User posts */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Posts by {user.displayName}
          </h2>
          
          {posts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No posts yet.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                >
                  <Link
                    to={`/posts/${post.slug}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-4 -m-4 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
