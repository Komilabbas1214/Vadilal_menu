import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import API from '../services/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Fire confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (!order) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.error('Fetch order details error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-pink" role="status"></div>
        <p className="mt-2 text-muted">Loading order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold text-danger">Order details not found</h4>
        <Link to="/" className="btn btn-pink text-white rounded-pill px-4 mt-3">
          Back to Home
        </Link>
      </div>
    );
  }

  // Build WhatsApp Pre-filled text string
  const generateWhatsAppUrl = () => {
    const itemsText = order.items
      .map((item) => `• ${item.name} x ${item.quantity} (₹${item.subtotal})`)
      .join('\n');

    const messageText = `🍦 *HANGOUT ICE CREAM ORDER CONFIRMATION* 🍦

*Order Token:* ${order.orderNumber}
*Customer:* ${order.customerName}
*Mobile:* ${order.mobile}
*Order Type:* ${order.orderType} ${order.tableNumber ? `(${order.tableNumber})` : ''}

*Items:*
${itemsText}

*Total Amount:* ₹${order.totalAmount}
*Status:* ${order.status}

Thank you for ordering with Hangout AI! 🎉`;

    return `https://wa.me/?text=${encodeURIComponent(messageText)}`;
  };

  return (
    <div className="container max-width-1200 py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 text-center p-4 p-md-5 bg-white">
            <div className="fs-1 mb-2">🎉</div>
            <h2 className="fw-bold text-success mb-2">Order Confirmed!</h2>
            <p className="text-muted mb-4">Please wait while we prepare your delicious ice cream.</p>

            {/* Token Badge */}
            <div className="p-3 mb-4 rounded-4 text-white shadow-sm bg-dark">
              <span className="small text-white-50 text-uppercase d-block mb-1 fw-bold">Your Token Number</span>
              <div className="display-4 fw-extrabold text-pink" style={{ color: '#ff477e' }}>
                {order.orderNumber}
              </div>
              <div className="mt-2">
                <span className="badge bg-warning text-dark rounded-pill px-3 py-1 fw-bold">
                  Status: {order.status}
                </span>
              </div>
            </div>

            {/* Order Details Breakdown */}
            <div className="bg-light p-4 rounded-4 text-start mb-4">
              <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">Order Details</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Customer Name:</span>
                <span className="fw-bold">{order.customerName}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Order Type:</span>
                <span className="fw-bold">{order.orderType} {order.tableNumber && `(${order.tableNumber})`}</span>
              </div>

              <div className="my-3 border-top pt-2">
                <div className="fw-bold text-secondary mb-2">Items Ordered:</div>
                {order.items.map((it, idx) => (
                  <div key={idx} className="d-flex justify-content-between small mb-1">
                    <span>{it.name} × {it.quantity}</span>
                    <span className="fw-semibold">₹{it.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between border-top pt-2 fs-5 fw-bold text-dark">
                <span>Total Amount:</span>
                <span className="text-pink">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* WhatsApp Integration Button */}
            <div className="d-flex flex-column gap-2">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success py-3 rounded-pill fw-bold text-white fs-6 shadow-sm border-0 d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: '#25D366' }}
              >
                <i className="bi bi-whatsapp fs-5"></i> Send Order on WhatsApp
              </a>

              <Link to="/" className="btn btn-outline-secondary rounded-pill py-2 fw-semibold">
                Back to Home Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
