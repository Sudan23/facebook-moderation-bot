const mongoose = require('mongoose');

/**
 * Comment Schema
 * Stores Facebook comments with their moderation status and AI analysis results
 */
const commentSchema = new mongoose.Schema({
  // Facebook-specific fields
  facebookId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  postId: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  from: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  createdTime: {
    type: Date,
    required: true
  },
  
  // AI Moderation Results
  toxicityScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0
  },
  isHateful: {
    type: Boolean,
    default: false
  },
  isNegative: {
    type: Boolean,
    default: false
  },
  
  // Moderation Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'hidden', 'deleted'],
    default: 'pending',
    index: true
  },
  
  // Moderation Metadata
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  autoModerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for efficient querying
commentSchema.index({ status: 1, createdTime: -1 });
commentSchema.index({ isHateful: 1, isNegative: 1 });

module.exports = mongoose.model('Comment', commentSchema);
