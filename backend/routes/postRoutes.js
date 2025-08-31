const express = require('express');
const { body } = require('express-validator');
const { auth, optionalAuth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts
} = require('../controllers/postController');

const router = express.Router();

// Validation middleware
const createPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Excerpt cannot exceed 300 characters'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        return value.every(cat => 
          typeof cat === 'string' && cat.trim().length > 0 && cat.trim().length <= 50
        );
      }
      return true;
    })
    .withMessage('Each category must be a string between 1 and 50 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        return value.every(tag => 
          typeof tag === 'string' && tag.trim().length > 0 && tag.trim().length <= 30
        );
      }
      return true;
    })
    .withMessage('Each tag must be a string between 1 and 30 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  
  body('featuredImage')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  
  body('seo.metaTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Meta title cannot exceed 60 characters'),
  
  body('seo.metaDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Meta description cannot exceed 160 characters'),
  
  body('seo.keywords')
    .optional()
    .isArray()
    .withMessage('SEO keywords must be an array')
];

const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Excerpt cannot exceed 300 characters'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        return value.every(cat => 
          typeof cat === 'string' && cat.trim().length > 0 && cat.trim().length <= 50
        );
      }
      return true;
    })
    .withMessage('Each category must be a string between 1 and 50 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        return value.every(tag => 
          typeof tag === 'string' && tag.trim().length > 0 && tag.trim().length <= 30
        );
      }
      return true;
    })
    .withMessage('Each tag must be a string between 1 and 30 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  
  body('featuredImage')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL')
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
];

// Public routes
router.get('/', optionalAuth, getPosts);
router.get('/:slug', optionalAuth, getPost);
router.get('/user/:username', getUserPosts);

// Protected routes
router.post('/', auth, createPostValidation, createPost);
router.put('/:id', auth, updatePostValidation, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, toggleLike);
router.post('/:id/comment', auth, commentValidation, addComment);

module.exports = router;
