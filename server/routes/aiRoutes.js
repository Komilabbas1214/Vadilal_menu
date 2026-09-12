const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/chat', aiLimiter, chatWithAI);

module.exports = router;
