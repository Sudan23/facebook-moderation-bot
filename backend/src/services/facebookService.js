const axios = require('axios');

/**
 * Facebook Service
 * Handles all interactions with Facebook Graph API v18.0
 */

const API_VERSION = process.env.FACEBOOK_API_VERSION || 'v18.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

/**
 * Get user's managed pages
 * @param {string} accessToken - User access token
 * @returns {Promise<Array>} List of pages with access tokens
 */
async function getUserPages(accessToken) {
  try {
    const response = await axios.get(`${BASE_URL}/me/accounts`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,access_token'
      }
    });
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching user pages:', error.response?.data || error.message);
    throw new Error('Failed to fetch user pages from Facebook');
  }
}

/**
 * Fetch posts from a Facebook page
 * @param {string} pageId - Facebook page ID
 * @param {string} accessToken - Page access token
 * @param {number} limit - Maximum number of posts to fetch
 * @returns {Promise<Array>} List of posts
 */
async function getPagePosts(pageId, accessToken, limit = 25) {
  try {
    const response = await axios.get(`${BASE_URL}/${pageId}/posts`, {
      params: {
        access_token: accessToken,
        fields: 'id,message,created_time',
        limit: limit
      }
    });
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching page posts:', error.response?.data || error.message);
    throw new Error('Failed to fetch posts from Facebook');
  }
}

/**
 * Fetch comments for a specific post
 * @param {string} postId - Facebook post ID
 * @param {string} accessToken - Page access token
 * @param {number} limit - Maximum number of comments to fetch
 * @returns {Promise<Array>} List of comments
 */
async function getPostComments(postId, accessToken, limit = 100) {
  try {
    const response = await axios.get(`${BASE_URL}/${postId}/comments`, {
      params: {
        access_token: accessToken,
        fields: 'id,message,from,created_time',
        limit: limit
      }
    });
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching post comments:', error.response?.data || error.message);
    // Return empty array instead of throwing to allow partial sync
    return [];
  }
}

/**
 * Hide a comment on Facebook
 * @param {string} commentId - Facebook comment ID
 * @param {string} accessToken - Page access token
 * @returns {Promise<boolean>} Success status
 */
async function hideComment(commentId, accessToken) {
  try {
    await axios.post(`${BASE_URL}/${commentId}`, null, {
      params: {
        access_token: accessToken,
        is_hidden: true
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error hiding comment:', error.response?.data || error.message);
    throw new Error('Failed to hide comment on Facebook');
  }
}

/**
 * Delete a comment on Facebook
 * @param {string} commentId - Facebook comment ID
 * @param {string} accessToken - Page access token
 * @returns {Promise<boolean>} Success status
 */
async function deleteComment(commentId, accessToken) {
  try {
    await axios.delete(`${BASE_URL}/${commentId}`, {
      params: {
        access_token: accessToken
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error.response?.data || error.message);
    throw new Error('Failed to delete comment on Facebook');
  }
}

/**
 * Fetch all comments from all posts of a page
 * @param {string} pageId - Facebook page ID
 * @param {string} accessToken - Page access token
 * @returns {Promise<Array>} List of all comments
 */
async function fetchAllPageComments(pageId, accessToken) {
  try {
    const posts = await getPagePosts(pageId, accessToken, 25);
    const allComments = [];
    
    for (const post of posts) {
      const comments = await getPostComments(post.id, accessToken, 100);
      
      // Add post ID to each comment
      comments.forEach(comment => {
        comment.postId = post.id;
      });
      
      allComments.push(...comments);
    }
    
    console.log(`Fetched ${allComments.length} comments from ${posts.length} posts`);
    return allComments;
  } catch (error) {
    console.error('Error fetching all page comments:', error);
    throw error;
  }
}

/**
 * Get user profile information
 * @param {string} accessToken - User access token
 * @returns {Promise<Object>} User profile
 */
async function getUserProfile(accessToken) {
  try {
    const response = await axios.get(`${BASE_URL}/me`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,email'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw new Error('Failed to fetch user profile from Facebook');
  }
}

module.exports = {
  getUserPages,
  getPagePosts,
  getPostComments,
  hideComment,
  deleteComment,
  fetchAllPageComments,
  getUserProfile
};
