import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  playOrderChime,
  startContinuousOrderRinging,
  stopContinuousOrderRinging,
} from '../components/AudioNotification';

const statusColors = {
  Pending: 'bg-warning text-dark',
  Accepted: 'bg-info text-dark',
  Preparing: 'bg-primary text-white',
  Ready: 'bg-success text-white',
  Completed: 'bg-secondary text-white',
  Cancelled: 'bg-danger text-white',
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrdersCount: 0,
    pendingCount: 0,
    preparingCount: 0,
    readyCount: 0,
    completedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000); // Live poll every 3 seconds

    return () => {
      clearInterval(interval);
      stopContinuousOrderRinging(); // Stop sound on unmount
    };
  }, [statusFilter, soundEnabled]);

  const fetchDashboardData = async () => {
    try {
      // Fetch Stats
      const statsRes = await API.get('/admin/stats');
      if (statsRes.data.success) {
        const newStats = statsRes.data.data;
        setStats(newStats);

        // CONTINUOUS RING SOUND LOGIC:
        // Ring continuously if there is ANY pending order and sound is enabled!
        if (soundEnabled && newStats.pendingCount > 0) {
          startContinuousOrderRinging();
        } else {
          stopContinuousOrderRinging();
        }
      }

      // Fetch Orders List
      let url = '/orders?date=today';
      if (statusFilter !== 'All') {
        url += `&status=${statusFilter}`;
      }
      const ordersRes = await API.get(url);
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        // Re-fetch data immediately; if pending count becomes 0, ring stops!
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (!nextState) {
      stopContinuousOrderRinging();
    }
  };

  const handleTestRingSound = () => {
    playOrderChime();
  };

  return (
    <div className="container-fluid max-width-1400 py-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            Store Orders Dashboard 🍦
            {stats.pendingCount > 0 && (
              <span className="badge bg-danger rounded-pill fs-6 animate-pulse">
                🔔 {stats.pendingCount} Pending Order(s) Ringing!
              </span>
            )}
          </h2>
          <p className="text-muted mb-0 small">Live kitchen pipeline & status management</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Test Ring Bell Button */}
          <button
            className="btn btn-outline-warning text-dark rounded-pill fw-semibold border-2"
            onClick={handleTestRingSound}
            title="Click to test order ringing sound & enable browser audio"
          >
            <i className="bi bi-bell-fill me-1 text-warning"></i> Test Sound 🔔
          </button>

          {/* Sound Toggle */}
          <button
            className={`btn rounded-pill fw-semibold border-0 ${
              soundEnabled ? 'btn-success text-white' : 'btn-light text-muted border'
            }`}
            onClick={handleToggleSound}
          >
            <i className={`bi ${soundEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'} me-1`}></i>
            Order Sound: {soundEnabled ? 'ON' : 'OFF'}
          </button>

          <button className="btn btn-outline-secondary rounded-circle" onClick={fetchDashboardData} title="Refresh Now">
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>

      {/* Sales & Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-4 col-lg-2.4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-5 border-success">
            <span className="small text-muted fw-bold text-uppercase">Today's Sales</span>
            <div className="fs-3 fw-bold text-dark mt-1">₹{stats.todaySales}</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-5 border-warning position-relative">
            <span className="small text-muted fw-bold text-uppercase">Pending</span>
            <div className="fs-3 fw-bold text-warning mt-1">{stats.pendingCount}</div>
            {stats.pendingCount > 0 && (
              <span className="position-absolute top-0 end-0 m-2 spinner-grow spinner-grow-sm text-warning" role="status"></span>
            )}
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-5 border-primary">
            <span className="small text-muted fw-bold text-uppercase">Preparing</span>
            <div className="fs-3 fw-bold text-primary mt-1">{stats.preparingCount}</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-5 border-info">
            <span className="small text-muted fw-bold text-uppercase">Ready</span>
            <div className="fs-3 fw-bold text-info mt-1">{stats.readyCount}</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-5 border-secondary">
            <span className="small text-muted fw-bold text-uppercase">Completed</span>
            <div className="fs-3 fw-bold text-secondary mt-1">{stats.completedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 overflow-x-auto pb-2 mb-3">
        {['All', 'Pending', 'Accepted', 'Preparing', 'Ready', 'Completed'].map((st) => (
          <button
            key={st}
            className={`btn btn-sm rounded-pill px-3 fw-semibold text-nowrap ${
              statusFilter === st ? 'btn-dark' : 'btn-light text-muted border'
            }`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="py-3 ps-4">Token #</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Order Type</th>
                <th className="py-3">Items Breakdown</th>
                <th className="py-3">Total</th>
                <th className="py-3">Time</th>
                <th className="py-3">Status</th>
                <th className="py-3 pe-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    Loading live orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No orders found for this status.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className={ord.status === 'Pending' ? 'table-warning' : ''}>
                    <td className="ps-4">
                      <span className="fw-extrabold fs-6 text-pink" style={{ color: '#ff477e' }}>{ord.orderNumber}</span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{ord.customerName}</div>
                      <div className="small text-muted">{ord.mobile}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {ord.orderType} {ord.tableNumber ? `(${ord.tableNumber})` : ''}
                      </span>
                    </td>
                    <td>
                      <div className="small">
                        {ord.items.map((it, idx) => (
                          <div key={idx}>
                            • {it.name} × <strong>{it.quantity}</strong>
                          </div>
                        ))}
                      </div>
                      {ord.specialInstructions && (
                        <div className="text-danger small mt-1">
                          <i className="bi bi-info-circle me-1"></i> {ord.specialInstructions}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="fw-bold fs-6">₹{ord.totalAmount}</span>
                    </td>
                    <td className="small text-muted">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${statusColors[ord.status] || 'bg-secondary'}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="pe-4 text-center">
                      {/* Next Status Quick Buttons */}
                      {ord.status === 'Pending' && (
                        <button
                          className="btn btn-sm btn-success text-white rounded-pill fw-bold shadow-sm"
                          onClick={() => handleStatusChange(ord._id, 'Accepted')}
                        >
                          <i className="bi bi-check-circle me-1"></i> Accept Order (Stop Bell)
                        </button>
                      )}
                      {ord.status === 'Accepted' && (
                        <button
                          className="btn btn-sm btn-primary rounded-pill fw-bold"
                          onClick={() => handleStatusChange(ord._id, 'Preparing')}
                        >
                          Mark Preparing
                        </button>
                      )}
                      {ord.status === 'Preparing' && (
                        <button
                          className="btn btn-sm btn-info text-dark rounded-pill fw-bold"
                          onClick={() => handleStatusChange(ord._id, 'Ready')}
                        >
                          Mark Ready
                        </button>
                      )}
                      {ord.status === 'Ready' && (
                        <button
                          className="btn btn-sm btn-secondary rounded-pill fw-bold"
                          onClick={() => handleStatusChange(ord._id, 'Completed')}
                        >
                          Mark Completed
                        </button>
                      )}
                      {ord.status === 'Completed' && (
                        <span className="text-muted small">
                          <i className="bi bi-check-all text-success fs-5"></i> Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
