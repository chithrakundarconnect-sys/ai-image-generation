// imageRoutes.js

const express = require('express');
const router = express.Router();

// Middleware to protect routes (authentication)
const protect = require('../middleware/authMiddleware');

// Import all image controller functions
const {
  createImage,    // Create new image record
  getAllImages,   // Get all images (public)
  getUserImages,  // Get images for the logged-in user
  toggleFavorite, // Toggle favorite status of an image by ID
  deleteImage,    // Delete an image by ID
} = require('../controller/imageController');

// ----- ROUTES ----- //

// Public route: Get all images for public gallery or admin use
router.get('/', getAllImages);

// Protected route: Create a new image (requires auth)
router.post('/', protect, createImage);

// Protected route: Get all images uploaded by logged-in user
router.get('/user/images', protect, getUserImages);

// Protected route: Toggle favorite status of an image by its ID
router.patch('/:id/favorite', protect, toggleFavorite);

// Protected route: Delete an image by its ID
router.delete('/:id', protect, deleteImage);

// Export router to use in index.js
module.exports = router;