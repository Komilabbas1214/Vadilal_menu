const Product = require('../models/Product');

// @desc    Get all products (with search & category filtering)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, availableOnly } = req.query;
    let query = {};

    if (availableOnly === 'true') {
      query.available = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { flavour: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get Product By ID Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, category, description, flavour, size, price, image, ingredients, tags, available } = req.body;

    if (!name || !category || !flavour || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, Category, Flavour, and Price are required' });
    }

    const product = await Product.create({
      name,
      category,
      description: description || '',
      flavour,
      size: size || 'Standard',
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map(s => s.trim()) : []),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(s => s.trim()) : []),
      available: available !== undefined ? available : true,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product: ' + error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateData = { ...req.body };
    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = updateData.ingredients.split(',').map(s => s.trim());
    }
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(s => s.trim());
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
