import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenCart, onOpenAI }) => {
  const { cartCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar sticky-top hangout-navbar py-2 px-3">
      <div className="container-fluid max-width-1200 d-flex justify-content-between align-items-center">
        {/* Brand Logo & Name */}
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div className="brand-badge fs-5">
            <span>🍦</span> Hangout
          </div>
          <span className="badge bg-light text-pink border border-pink-subtle d-none d-sm-inline-block rounded-pill">
            Smart Ordering
          </span>
        </Link>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          {!isAdmin && (
            <>
              <button
                className="btn btn-outline-purple rounded-pill px-3 py-1 fw-bold border-2 d-flex align-items-center gap-2 text-purple"
                onClick={onOpenAI}
                style={{ borderColor: '#7b2cbf', color: '#7b2cbf' }}
              >
                <i className="bi bi-robot fs-5"></i>
                <span className="d-none d-md-inline">Ask AI</span>
              </button>

              <button
                className="btn btn-pink rounded-pill px-3 py-1 position-relative fw-bold text-white d-flex align-items-center gap-2"
                onClick={onOpenCart}
                style={{ background: 'linear-gradient(135deg, #ff477e 0%, #ff70a6 100%)' }}
              >
                <i className="bi bi-bag-fill fs-5"></i>
                <span className="d-none d-sm-inline">Cart</span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Admin Navigation */}
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn btn-dark rounded-pill px-3 py-1 dropdown-toggle fw-semibold"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-1"></i> Admin
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4">
                <li>
                  <Link className="dropdown-menu-item dropdown-item fw-medium" to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-2"></i> Orders Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-menu-item dropdown-item fw-medium" to="/admin/products">
                    <i className="bi bi-grid me-2"></i> Manage Menu
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-menu-item dropdown-item fw-medium" to="/admin/qr">
                    <i className="bi bi-qr-code-scan me-2"></i> QR Code Standee
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger fw-semibold" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            !isAdmin && (
              <Link to="/admin/login" className="btn btn-link text-secondary text-decoration-none px-2 me-1" title="Admin Login">
                <i className="bi bi-shield-lock fs-5"></i>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
