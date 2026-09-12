const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper to generate next unique order token (e.g. HNG-101)
const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  const nextNum = 101 + count;
  return `HNG-${nextNum}`;
};

// @desc    Create new customer order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { customerName, mobile, items, orderType, tableNumber, specialInstructions } = req.body;

    if (!customerName || !mobile || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide customer name, mobile, and at least one item' });
    }

    if (orderType === 'Dine-in' && !tableNumber) {
      return res.status(400).json({ success: false, message: 'Table number is required for Dine-in orders' });
    }

    // SECURITY: Validate items & calculate totals from DB prices!
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId || item.product);

      if (!dbProduct) {
        return res.status(400).json({ success: false, message: `Product ${item.name || ''} no longer exists` });
      }

      if (!dbProduct.available) {
        return res.status(400).json({ success: false, message: `Sorry, ${dbProduct.name} is currently out of stock` });
      }

      const qty = Math.max(1, parseInt(item.quantity) || 1);
      const subtotal = dbProduct.price * qty;
      totalAmount += subtotal;

      validatedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        size: dbProduct.size,
        quantity: qty,
        subtotal: subtotal,
      });
    }

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      items: validatedItems,
      totalAmount,
      orderType: orderType || 'Dine-in',
      tableNumber: orderType === 'Dine-in' ? tableNumber.trim() : '',
      specialInstructions: specialInstructions ? specialInstructions.trim() : '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order: ' + error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// @desc    Get single order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      order = await Order.findOne({ orderNumber: req.params.id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get Order By ID Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
