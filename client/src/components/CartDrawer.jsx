import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div className="modal-dialog modal-dialog-slideout modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg" style={{ maxHeight: '90vh' }}>
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold fs-4 d-flex align-items-center gap-2">
              <span>🛒</span> Your Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body py-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 mb-2">🍦</div>
                <h6 className="fw-bold text-muted">Your cart is empty</h6>
                <p className="small text-secondary mb-3">Add some delicious ice cream scoops or ask AI!</p>
                <button className="btn btn-outline-pink rounded-pill px-4 fw-bold" onClick={onClose}>
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between gap-2"
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                    <div className="flex-grow-1 min-width-0">
                      <h6 className="mb-0 fw-bold text-truncate" title={item.name}>
                        {item.name}
                      </h6>
                      <div className="text-muted small">
                        ₹{item.price} • {item.size}
                      </div>
                      <div className="fw-bold text-pink small">
                        Subtotal: ₹{item.price * item.quantity}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="d-flex align-items-center gap-2 bg-white rounded-pill p-1 border">
                      <button
                        className="btn btn-sm btn-light rounded-circle p-0"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => updateQuantity(item.productId, -1)}
                      >
                        -
                      </button>
                      <span className="fw-bold px-1" style={{ minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-sm btn-light rounded-circle p-0"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => updateQuantity(item.productId, 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      className="btn btn-link text-danger p-1"
                      onClick={() => removeFromCart(item.productId)}
                      title="Remove Item"
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  </div>
                ))}

                <div className="d-flex justify-content-end">
                  <button className="btn btn-sm btn-link text-muted text-decoration-none" onClick={clearCart}>
                    <i className="bi bi-x-circle me-1"></i> Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="modal-footer border-top-0 flex-column bg-light rounded-bottom-4">
              <div className="w-100 d-flex justify-content-between align-items-center mb-3">
                <span className="fw-semibold text-muted">Subtotal:</span>
                <span className="fs-4 fw-bold text-dark">₹{subtotal}</span>
              </div>

              <button
                className="btn w-100 py-3 rounded-pill fw-bold text-white fs-5 border-0 shadow"
                style={{ background: 'linear-gradient(135deg, #ff477e 0%, #ff70a6 100%)' }}
                onClick={handleCheckout}
              >
                Proceed to Checkout <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
