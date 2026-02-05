const mongoose = require('mongoose');

/**
 * User Schema
 * Stores user information, Facebook tokens, and moderation settings
 */
const userSchema = new mongoose.Schema({
  // Facebook User Info
  facebookId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true // Allow null but enforce uniqueness when present
  },
  
  // Access Tokens
  accessToken: {
    type: String,
    required: true
  },
  
  // Facebook Pages managed by this user
  pageAccessTokens: [{
    pageId: {
      type: String,
      required: true
    },
    pageName: {
      type: String,
      required: true
    },
    accessToken: {
      type: String,
      required: true
    }
  }],
  
  // Moderation Settings
  settings: {
    autoModerate: {
      type: Boolean,
      default: true
    },
    toxicityThreshold: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.7
    },
    sentimentThreshold: {
      type: Number,
      min: -1,
      max: 1,
      default: -0.5
    },
    autoHide: {
      type: Boolean,
      default: true
    },
    autoDelete: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
