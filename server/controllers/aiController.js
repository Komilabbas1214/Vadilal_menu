const { getAIRecommendations } = require('../services/aiService');

// @desc    Get AI Ice Cream Recommendations
// @route   POST /api/ai/chat
// @access  Public (Rate Limited)
const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please ask a question or share what ice cream you are looking for!',
      });
    }

    const aiResult = await getAIRecommendations(message.trim(), history || []);

    res.json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI recommendation',
    });
  }
};

module.exports = { chatWithAI };
