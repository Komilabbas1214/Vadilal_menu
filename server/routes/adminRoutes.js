const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');

router.get('/stats', protectAdmin, getAdminStats);

module.exports = router;
