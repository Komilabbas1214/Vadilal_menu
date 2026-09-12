const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protectAdmin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

module.exports = router;
