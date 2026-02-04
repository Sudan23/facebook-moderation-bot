const toxicity = require('@tensorflow-models/toxicity');

/**
 * AI Moderation Service
 * Uses TensorFlow.js toxicity model and sentiment analysis to moderate comments
 */

// Sentiment keyword dictionaries
const NEGATIVE_KEYWORDS = [
  'hate', 'awful', 'terrible', 'horrible', 'disgusting', 'worst', 'stupid',
  'idiot', 'dumb', 'sucks', 'garbage', 'trash', 'useless', 'pathetic',
  'annoying', 'frustrating', 'angry', 'mad', 'disappointed', 'upset'
];

const POSITIVE_KEYWORDS = [
  'love', 'great', 'awesome', 'amazing', 'wonderful', 'excellent', 'fantastic',
  'good', 'nice', 'beautiful', 'perfect', 'best', 'happy', 'thank', 'thanks',
  'appreciate', 'helpful', 'impressive', 'brilliant', 'outstanding'
];

let toxicityModel = null;

/**
 * Initialize the TensorFlow toxicity model
 * @param {number} threshold - Toxicity threshold (0-1)
 * @returns {Promise<void>}
 */
async function initializeToxicityModel(threshold = 0.7) {
  try {
    console.log('Loading TensorFlow toxicity model...');
    toxicityModel = await toxicity.load(threshold);
    console.log('✓ TensorFlow toxicity model loaded successfully');
  } catch (error) {
    console.error('Error loading toxicity model:', error);
    throw error;
  }
}

/**
 * Calculate sentiment score based on keyword matching
 * @param {string} text - Text to analyze
 * @returns {number} Sentiment score (-1 to 1)
 */
function calculateSentiment(text) {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Count positive keywords
  POSITIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score += 0.2;
    }
  });
  
  // Count negative keywords
  NEGATIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score -= 0.2;
    }
  });
  
  // Normalize to -1 to 1 range
  return Math.max(-1, Math.min(1, score));
}

/**
 * Analyze comment for toxicity and sentiment
 * @param {string} text - Comment text to analyze
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeComment(text) {
  try {
    // Default values in case of error
    let toxicityScore = 0;
    let isHateful = false;
    
    // Analyze toxicity if model is loaded
    if (toxicityModel && text && text.trim().length > 0) {
      const predictions = await toxicityModel.classify([text]);
      
      // Calculate average toxicity score across all categories
      let totalScore = 0;
      let categoryCount = 0;
      
      predictions.forEach(prediction => {
        if (prediction.results && prediction.results[0]) {
          const match = prediction.results[0].match;
          if (match) {
            totalScore += prediction.results[0].probabilities[1]; // Probability of toxic
            categoryCount++;
          }
        }
      });
      
      if (categoryCount > 0) {
        toxicityScore = totalScore / categoryCount;
        isHateful = toxicityScore > 0.7; // Default threshold
      }
    }
    
    // Calculate sentiment score
    const sentimentScore = calculateSentiment(text);
    const isNegative = sentimentScore < -0.5; // Default threshold
    
    return {
      toxicityScore: Math.round(toxicityScore * 1000) / 1000, // Round to 3 decimals
      sentimentScore: Math.round(sentimentScore * 1000) / 1000,
      isHateful,
      isNegative
    };
  } catch (error) {
    console.error('Error analyzing comment:', error);
    // Return safe defaults on error
    return {
      toxicityScore: 0,
      sentimentScore: 0,
      isHateful: false,
      isNegative: false
    };
  }
}

/**
 * Determine moderation action based on settings and scores
 * @param {Object} analysis - Analysis results from analyzeComment
 * @param {Object} settings - User moderation settings
 * @returns {string} Recommended action: 'approve', 'hide', or 'delete'
 */
function getModerationAction(analysis, settings) {
  const {
    autoModerate = true,
    toxicityThreshold = 0.7,
    sentimentThreshold = -0.5,
    autoHide = true,
    autoDelete = false
  } = settings;
  
  // If auto-moderation is disabled, leave as pending
  if (!autoModerate) {
    return 'pending';
  }
  
  // Check if comment exceeds thresholds
  const isToxic = analysis.toxicityScore >= toxicityThreshold;
  const isNegative = analysis.sentimentScore <= sentimentThreshold;
  
  if (isToxic || isNegative) {
    if (autoDelete) {
      return 'deleted';
    } else if (autoHide) {
      return 'hidden';
    }
  }
  
  return 'approved';
}

module.exports = {
  initializeToxicityModel,
  analyzeComment,
  calculateSentiment,
  getModerationAction
};
