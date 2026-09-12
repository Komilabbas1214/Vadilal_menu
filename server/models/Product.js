const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Scoops',
      'Sundaes',
      'Shakes',
      'Brownies',
      'Cakes',
      'Tubs',
      'Kulfi',
      'Bars / Novelties',
      'Party Packs',
      'Other',
    ],
  },
  description: {
    type: String,
    default: '',
  },
  flavour: {
    type: String,
    required: [true, 'Flavour is required'],
    trim: true,
  },
  tasteProfile: {
    type: String,
    default: 'Rich and creamy ice cream flavour.',
  },
  sweetness: {
    type: String,
    default: 'Medium',
  },
  texture: {
    type: String,
    default: 'Smooth and creamy',
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    default: '120ml',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
  },
  ingredients: [{
    type: String,
  }],
  allergens: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
