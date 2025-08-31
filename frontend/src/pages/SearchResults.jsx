import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      // TODO: Implement actual search functionality
      // For now, using mock data
      setTimeout(() => {
        const mockResults = [
          {
            id: 1,
            title: 'Getting Started with React Hooks',
            excerpt: 'Learn how to use React Hooks to manage state and side effects in functional components. This comprehensive guide covers useState, useEffect, and custom hooks.',
            slug: 'getting-started-with-react-hooks',
            author: 'John Doe',
            createdAt: '2024-01-10',
            readTime: '5 min read',
            tags: ['react', 'hooks', 'javascript']
          },
          {
            id: 2,
            title: 'Building a REST API with Node.js',
            excerpt: 'A comprehensive guide to building scalable REST APIs using Node.js and Express. Learn about routing, middleware, authentication, and database integration.',
            slug: 'building-rest-api-nodejs',
            author: 'Jane Smith',
            createdAt: '2024-01-05',
            readTime: '8 min read',
            tags: ['nodejs', 'express', 'api']
          },
          {
            id: 3,
            title: 'CSS Grid Layout Tutorial',
            excerpt: 'Master CSS Grid Layout with this detailed tutorial. Learn about grid containers, grid items, and how to create complex layouts easily.',
            slug: 'css-grid-layout-tutorial',
            author: 'Mike Johnson',
            createdAt: '2024-01-01',
            readTime: '6 min read',
            tags: ['css', 'grid', 'layout']
          }
        ];
        
        setResults(mockResults);
        setTotalResults(mockResults.length);
        setIsLoading(false);
      }, 1000);
    } else {
      setResults([]);
      setTotalResults(0);
      setIsLoading(false);
    }
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
            <FiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Search Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Use the search bar to find posts on our blog.
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
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-500"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Search results header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <FiSearch className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
            <FiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search terms or browse our latest posts.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Posts
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="space-y-6">
              {results.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                >
                  <Link
                    to={`/posts/${post.slug}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-4 -m-4 transition-colors duration-200"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Post metadata */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <span>{post.readTime}</span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
