import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../services/api';

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [orderType, setOrderType] = useState('Dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="container max-width-1200 py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5">
          <div className="fs-1 mb-3">🍦</div>
          <h4 className="fw-bold text-dark">Your cart is empty!</h4>
          <p className="text-muted mb-4">Please add items to your cart before proceeding to checkout.</p>
          <div>
            <Link to="/" className="btn btn-pink text-white rounded-pill px-4 py-2 fw-bold">
              Return to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (orderType === 'Dine-in' && !tableNumber.trim()) {
      setError('Please enter your Table Number for Dine-in orders');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName,
        mobile,
        orderType,
        tableNumber: orderType === 'Dine-in' ? tableNumber : '',
        specialInstructions,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
        })),
      };

      const res = await API.post('/orders', orderPayload);
      if (res.data.success) {
        const createdOrder = res.data.data;
        clearCart();
        navigate(`/order-success/${createdOrder._id}`, { state: { order: createdOrder } });
      }
    } catch (err) {
      console.error('Submit order error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-width-1200 py-4">
      <div className="d-flex align-items-center mb-4 gap-2">
        <Link to="/" className="btn btn-light rounded-circle shadow-sm">
          <i className="bi bi-arrow-left fs-5"></i>
        </Link>
        <h2 className="fw-bold mb-0 text-dark">Checkout & Order</h2>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="row g-4">
        {/* Customer Details Form */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3 text-dark border-bottom pb-2">1. Customer Details</h5>

            <form onSubmit={handleSubmitOrder}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Your Name *</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Mobile Number *</label>
                <input
                  type="tel"
                  className="form-control rounded-3 py-2"
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              {/* Order Type Toggle */}
              <div className="mb-3">
                <label className="form-label fw-semibold d-block">Order Type *</label>
                <div className="btn-group w-100 p-1 bg-light rounded-pill border" role="group">
                  <button
                    type="button"
                    className={`btn rounded-pill fw-bold ${
                      orderType === 'Dine-in' ? 'btn-pink text-white' : 'btn-light text-dark'
                    }`}
                    onClick={() => setOrderType('Dine-in')}
                  >
                    🍽️ Dine-in (At Store Table)
                  </button>
                  <button
                    type="button"
                    className={`btn rounded-pill fw-bold ${
                      orderType === 'Takeaway' ? 'btn-pink text-white' : 'btn-light text-dark'
                    }`}
                    onClick={() => setOrderType('Takeaway')}
                  >
                    🛍️ Takeaway / Parcel
                  </button>
                </div>
              </div>

              {/* Table Number if Dine-in */}
              {orderType === 'Dine-in' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Table Number *</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    placeholder="e.g. Table 05"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">Special Instructions (Optional)</label>
                <textarea
                  className="form-control rounded-3"
                  rows="2"
                  placeholder="e.g. Extra hot chocolate sauce on brownie, less ice in shake..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn w-100 py-3 rounded-pill fw-bold text-white fs-5 border-0 shadow"
                style={{ background: 'linear-gradient(135deg, #ff477e 0%, #ff70a6 100%)' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span> Processing Order...
                  </>
                ) : (
                  <>
                    Place Order (₹{subtotal}) <i className="bi bi-check-circle-fill ms-2"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3 text-dark border-bottom pb-2">2. Order Summary</h5>

            <div className="d-flex flex-column gap-3 mb-3">
              {cartItems.map((item) => (
                <div key={item.productId} className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold text-dark">{item.name}</div>
                    <div className="text-muted small">
                      ₹{item.price} × {item.quantity} ({item.size})
                    </div>
                  </div>
                  <div className="fw-bold text-pink">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-semibold">Subtotal</span>
              <span className="fw-bold">₹{subtotal}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-semibold">Taxes & Store Charges</span>
              <span className="text-success fw-bold">FREE</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-center fs-4 fw-bold text-dark">
              <span>Total Payable</span>
              <span className="text-pink">₹{subtotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
