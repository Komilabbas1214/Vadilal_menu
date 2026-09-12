const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    default: 'Standard',
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderType: {
    type: String,
    enum: ['Dine-in', 'Takeaway'],
    default: 'Dine-in',
  },
  tableNumber: {
    type: String,
    default: '',
  },
  specialInstructions: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
