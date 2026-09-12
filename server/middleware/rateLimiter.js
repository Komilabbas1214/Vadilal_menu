const rateLimit = require('express-rate-limit');

// Rate limit AI chat endpoint to prevent spam (max 20 requests per 1 minute per IP)
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI Assistant requests. Please wait a minute before asking again! 🍦',
  },
});

module.exports = { aiLimiter };
