import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiFileText, FiPlus, FiUser } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.username || 'User'}! This is your dashboard.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* My Posts Card */}
            <Link 
              to="/dashboard/posts" 
              className="bg-primary-50 dark:bg-primary-900 p-6 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 group-hover:text-primary-800 dark:group-hover:text-primary-200">
                    My Posts
                  </h3>
                  <p className="text-primary-700 dark:text-primary-300 mt-2">
                    Manage your blog posts
                  </p>
                </div>
                <FiFileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </Link>

            {/* Create Post Card */}
            <Link 
              to="/create-post" 
              className="bg-accent-50 dark:bg-accent-900 p-6 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-800 transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100 group-hover:text-accent-800 dark:group-hover:text-accent-200">
                    Create Post
                  </h3>
                  <p className="text-accent-700 dark:text-accent-300 mt-2">
                    Write a new blog post
                  </p>
                </div>
                <FiPlus className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              </div>
            </Link>

            {/* Profile Card */}
            <Link 
              to="/dashboard/profile" 
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                    Profile
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    Update your profile information
                  </p>
                </div>
                <FiUser className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
