import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AIChatModal from './components/AIChatModal';

import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminQRCodePage from './pages/AdminQRCodePage';

import { useAuth } from './context/AuthContext';

// Protected Route Wrapper for Admin
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="min-vh-100 d-flex flex-column bg-cream">
      <Navbar onOpenCart={() => setIsCartOpen(true)} onOpenAI={() => setIsAIOpen(true)} />

      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenAI={() => setIsAIOpen(true)} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/qr"
            element={
              <ProtectedAdminRoute>
                <AdminQRCodePage />
              </ProtectedAdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Shopping Cart Slide Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Global AI Chat Assistant Modal */}
      <AIChatModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

export default App;
