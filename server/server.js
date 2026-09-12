const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow connections from React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'Hangout AI - Smart Ice Cream Ordering',
    time: new Date().toISOString(),
  });
});

// Global 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Global Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Hangout AI Server running on port ${PORT}`);
  console.log(`🍦 Menu APIs: http://localhost:${PORT}/api/products`);
  console.log(`🤖 AI Assistant: http://localhost:${PORT}/api/ai/chat`);
});
