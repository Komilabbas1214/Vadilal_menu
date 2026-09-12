const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/auth');

router.route('/')
  .post(createOrder)
  .get(protectAdmin, getOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(protectAdmin, updateOrderStatus);

module.exports = router;
