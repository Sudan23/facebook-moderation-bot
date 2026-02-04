const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

/**
 * API Routes
 * All routes require authentication
 */

// Comment routes
router.post('/comments/sync', authenticateToken, commentController.syncComments);
router.get('/comments', authenticateToken, commentController.getComments);
router.post('/comments/:id/moderate', authenticateToken, commentController.moderateComment);
router.get('/comments/stats', authenticateToken, commentController.getStats);

module.exports = router;
