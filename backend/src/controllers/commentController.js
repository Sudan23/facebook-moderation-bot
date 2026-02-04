const Comment = require('../models/Comment');
const User = require('../models/User');
const moderationService = require('../services/moderationService');
const facebookService = require('../services/facebookService');

/**
 * Comment Controller
 * Handles all comment-related operations
 */

/**
 * Sync comments from Facebook
 * POST /api/comments/sync
 */
async function syncComments(req, res) {
  try {
    const user = req.user;
    const { pageId } = req.body;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: 'Page ID is required'
      });
    }
    
    // Find page access token
    const page = user.pageAccessTokens.find(p => p.pageId === pageId);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found or access denied'
      });
    }
    
    // Fetch comments from Facebook
    const fbComments = await facebookService.fetchAllPageComments(pageId, page.accessToken);
    
    let newCommentsCount = 0;
    let updatedCommentsCount = 0;
    
    // Process each comment
    for (const fbComment of fbComments) {
      try {
        // Check if comment already exists
        let comment = await Comment.findOne({ facebookId: fbComment.id });
        
        if (comment) {
          updatedCommentsCount++;
          continue; // Skip already processed comments
        }
        
        // Analyze comment with AI
        const analysis = await moderationService.analyzeComment(fbComment.message);
        
        // Determine moderation action
        const status = moderationService.getModerationAction(analysis, user.settings);
        
        // Create new comment
        comment = new Comment({
          facebookId: fbComment.id,
          postId: fbComment.postId,
          message: fbComment.message,
          from: fbComment.from,
          createdTime: new Date(fbComment.created_time),
          toxicityScore: analysis.toxicityScore,
          sentimentScore: analysis.sentimentScore,
          isHateful: analysis.isHateful,
          isNegative: analysis.isNegative,
          status: status,
          autoModerated: status !== 'pending'
        });
        
        await comment.save();
        newCommentsCount++;
        
        // Apply Facebook actions if auto-moderated
        if (status === 'hidden') {
          try {
            await facebookService.hideComment(fbComment.id, page.accessToken);
          } catch (error) {
            console.error('Failed to hide comment on Facebook:', error);
          }
        } else if (status === 'deleted') {
          try {
            await facebookService.deleteComment(fbComment.id, page.accessToken);
          } catch (error) {
            console.error('Failed to delete comment on Facebook:', error);
          }
        }
      } catch (error) {
        console.error('Error processing comment:', error);
        // Continue with next comment
      }
    }
    
    res.json({
      success: true,
      message: 'Comments synced successfully',
      data: {
        newComments: newCommentsCount,
        updatedComments: updatedCommentsCount,
        totalFetched: fbComments.length
      }
    });
  } catch (error) {
    console.error('Error syncing comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync comments',
      error: error.message
    });
  }
}

/**
 * Get comments with filtering and pagination
 * GET /api/comments?status=pending&page=1&limit=20
 */
async function getComments(req, res) {
  try {
    const {
      status,
      page = 1,
      limit = 20,
      isHateful,
      isNegative
    } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (isHateful !== undefined) {
      query.isHateful = isHateful === 'true';
    }
    
    if (isNegative !== undefined) {
      query.isNegative = isNegative === 'true';
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch comments
    const comments = await Comment.find(query)
      .sort({ createdTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Comment.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
}

/**
 * Moderate a specific comment
 * POST /api/comments/:id/moderate
 */
async function moderateComment(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body; // approve, hide, delete
    const user = req.user;
    
    if (!['approve', 'hide', 'delete'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be: approve, hide, or delete'
      });
    }
    
    // Find comment
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Map action to status
    const statusMap = {
      'approve': 'approved',
      'hide': 'hidden',
      'delete': 'deleted'
    };
    
    const newStatus = statusMap[action];
    
    // Update comment in database
    comment.status = newStatus;
    comment.moderatedBy = user._id;
    comment.moderatedAt = new Date();
    comment.autoModerated = false;
    
    await comment.save();
    
    // Apply action on Facebook if needed
    if (action === 'hide' || action === 'delete') {
      try {
        // Find page access token for this comment
        const fbComment = await facebookService.getPostComments(
          comment.postId,
          user.pageAccessTokens[0]?.accessToken,
          1
        );
        
        if (user.pageAccessTokens && user.pageAccessTokens.length > 0) {
          const pageToken = user.pageAccessTokens[0].accessToken;
          
          if (action === 'hide') {
            await facebookService.hideComment(comment.facebookId, pageToken);
          } else if (action === 'delete') {
            await facebookService.deleteComment(comment.facebookId, pageToken);
          }
        }
      } catch (error) {
        console.error('Failed to apply action on Facebook:', error);
        // Continue even if Facebook action fails
      }
    }
    
    res.json({
      success: true,
      message: `Comment ${action}d successfully`,
      data: comment
    });
  } catch (error) {
    console.error('Error moderating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to moderate comment',
      error: error.message
    });
  }
}

/**
 * Get comment statistics
 * GET /api/comments/stats
 */
async function getStats(req, res) {
  try {
    // Get counts for each status
    const [total, pending, approved, hidden, deleted, hateful, negative, autoModerated] = await Promise.all([
      Comment.countDocuments(),
      Comment.countDocuments({ status: 'pending' }),
      Comment.countDocuments({ status: 'approved' }),
      Comment.countDocuments({ status: 'hidden' }),
      Comment.countDocuments({ status: 'deleted' }),
      Comment.countDocuments({ isHateful: true }),
      Comment.countDocuments({ isNegative: true }),
      Comment.countDocuments({ autoModerated: true })
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        hidden,
        deleted,
        hateful,
        negative,
        autoModerated
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
}

module.exports = {
  syncComments,
  getComments,
  moderateComment,
  getStats
};
