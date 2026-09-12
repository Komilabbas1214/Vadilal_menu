# 🍦 Hangout AI – Smart Ice Cream Ordering MERN Web Application

A full-stack, mobile-first real-world ice cream ordering web application powered by **MongoDB, Express.js, React.js, and Node.js (MERN)** with a grounded **AI Ice Cream Assistant** (Hinglish/English), Admin Kanban order pipeline, WhatsApp integration, and printable table QR Code Standees.

---

## 🌟 Key Features

### 🛒 Customer Ordering Website
- **Mobile-First Responsive UI**: Styled with Bootstrap 5, custom pastel gradients, glassmorphism headers, and smooth micro-animations.
- **Dynamic Category Browsing**: Scoops, Sundaes, Shakes, Brownies, Cakes, Tubs, Kulfi, Bars / Novelties, Party Packs.
- **Live Search & Filter**: Real-time keyword search across names, flavours, descriptions, and tags.
- **Cart & Checkout**: Dine-in (with Table # selection) or Takeaway options with automatic backend price validation.
- **Order Token & WhatsApp Link**: Generates unique tokens (e.g. `HNG-101`) and pre-filled WhatsApp message buttons.

### 🤖 AI Ice Cream Assistant
- **Multilingual Understanding**: Natural Hinglish, Hindi, and English support (e.g., *"₹200 ke andar 2 logo ke liye chocolate ice cream chahiye"*).
- **Strict DB Grounding**: Recommended items & prices come directly from MongoDB. The AI **NEVER** fabricates fake products or prices.
- **Interactive Action Buttons**: Directly click `[Add to Cart]` from AI recommendations, `[Show More]`, or `[Change Budget]`.

### 🛡️ Admin Dashboard & Inventory Controls
- **JWT Protected Login**: Secure admin panel accessible at `/admin/login`.
- **Live Order Kanban Pipeline**: Monitor Today's Sales, Pending, Preparing, Ready, and Completed orders in real-time.
- **Audio Notifications**: Plays a chime sound automatically whenever a new pending order arrives.
- **Product Inventory Management**: Add new products, update prices, change stock availability, and manage categories.
- **Printable Table QR Standee**: Generate table-specific QR codes with the banner *"SCAN & ORDER 🍦 Ask AI what you should eat!"*.

---

## 📁 Project Structure

```text
Vadilal Menu Ai/
├── package.json               # Root scripts to run concurrently
├── README.md                  # Complete documentation
├── server/                    # Node.js + Express backend
│   ├── config/db.js           # Mongoose MongoDB connection
│   ├── controllers/           # Auth, Product, Order, Admin & AI controllers
│   ├── middleware/            # JWT auth & Express rate limiter
│   ├── models/                # Product, Order, User Mongoose schemas
│   ├── routes/                # REST API endpoints
│   ├── services/aiService.js  # Grounded AI recommendation engine
│   ├── seed.js                # Populates DB with products & Admin user
│   ├── server.js              # Express server entry point
│   ├── .env                   # Environment variables
│   └── .env.example
└── client/                    # React.js Vite frontend
    ├── index.html
    ├── vite.config.js
    ├── src/
    │   ├── components/        # Navbar, ProductCard, CartDrawer, AIChatModal
    │   ├── context/           # CartContext & AuthContext
    │   ├── pages/             # HomePage, CheckoutPage, OrderSuccessPage, Admin pages
    │   ├── services/api.js    # Axios client with JWT interceptor
    │   ├── App.jsx            # React router
    │   └── main.jsx           # Root DOM renderer
```

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- **Node.js**: v18+ installed on your system.
- **MongoDB**: Local MongoDB instance running at `mongodb://127.0.0.1:27017` or a MongoDB Atlas Connection URI.

### 2. Install All Dependencies
Run from the root directory:
```bash
npm run install-all
```
*(This installs root, server, and client npm packages automatically)*

---

## 🔑 Environment Variables Setup

Create a `.env` file in the `server/` directory (or edit the existing `server/.env`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hangout_icecream
JWT_SECRET=hangout_icecream_super_secret_jwt_key_2026
# Optional: Get your Gemini API key from Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: If `GEMINI_API_KEY` is omitted, the AI Assistant automatically falls back to an intelligent, grounded DB rule matcher.

---

## 🗄️ Database Seeding

Populate MongoDB with default ice cream menu items and the default Admin account:

```bash
npm run seed
```

### Default Admin Credentials:
- **Email**: `admin@hangout.com`
- **Password**: `admin123`

---

## 🖥️ Running the Application

### Option A: Run Full Stack Concurrently (Recommended)
Run from the root directory:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

### Option B: Run Backend & Frontend Separately

1. **Start Backend Server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start React Frontend**:
   ```bash
   cd client
   npm run dev
   ```

---

## ⚡ REST API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Admin JWT login
- `GET /api/auth/me` - Get current admin profile

### Products Inventory
- `GET /api/products` - Fetch all products (supports `?category=` & `?search=`)
- `GET /api/products/:id` - Fetch single product
- `POST /api/products` - Create product (Admin protected)
- `PUT /api/products/:id` - Update product (Admin protected)
- `DELETE /api/products/:id` - Delete product (Admin protected)

### Customer Orders
- `POST /api/orders` - Place customer order (Calculates totals securely on backend)
- `GET /api/orders` - Fetch all orders (Admin protected)
- `GET /api/orders/:id` - Fetch order details by ID or order token
- `PUT /api/orders/:id/status` - Update order status (Admin protected)

### AI & Analytics
- `POST /api/ai/chat` - AI Ice Cream Assistant recommendation endpoint (Rate limited)
- `GET /api/admin/stats` - Fetch real-time sales & order pipeline stats

---

## 🛡️ Security Features
1. **JWT Protection**: All admin endpoints enforce JSON Web Token authentication headers.
2. **Backend Price Recalculation**: Prices sent from frontend are never trusted; item subtotals and order totals are re-fetched directly from MongoDB during order creation.
3. **Rate Limiting**: Express rate limiter protects the AI chat endpoint against spam.
4. **Environment Variables**: API keys and secrets stay safely inside `server/.env`.

---

## 📄 License
Created for Hangout AI Ice Cream Store. Open for learning and real-world deployment! 🍦
