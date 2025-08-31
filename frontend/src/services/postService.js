import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postService = {
  // Get all posts with filters and pagination
  async getPosts(params = {}) {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Get single post by slug
  async getPost(slug) {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  },

  // Create new post
  async createPost(postData) {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update post
  async updatePost(id, postData) {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete post
  async deletePost(id) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Toggle post like
  async toggleLike(id) {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  // Add comment to post
  async addComment(id, commentData) {
    const response = await api.post(`/posts/${id}/comment`, commentData);
    return response.data;
  },

  // Get user's posts
  async getUserPosts(username, params = {}) {
    const response = await api.get(`/posts/user/${username}`, { params });
    return response.data;
  },

  // Search posts
  async searchPosts(query, params = {}) {
    const response = await api.get('/posts', { 
      params: { ...params, search: query } 
    });
    return response.data;
  },

  // Get posts by category
  async getPostsByCategory(category, params = {}) {
    const response = await api.get('/posts', { 
      params: { ...params, category } 
    });
    return response.data;
  },

  // Get posts by tag
  async getPostsByTag(tag, params = {}) {
    const response = await api.get('/posts', { 
      params: { ...params, tag } 
    });
    return response.data;
  },

  // Get posts by author
  async getPostsByAuthor(author, params = {}) {
    const response = await api.get('/posts', { 
      params: { ...params, author } 
    });
    return response.data;
  },
};

export default postService;
