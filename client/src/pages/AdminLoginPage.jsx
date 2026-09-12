import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@hangout.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/admin/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div className="brand-badge fs-4 mb-3">
                <span>🍦</span> Hangout Admin
              </div>
              <h4 className="fw-bold text-dark mb-1">Manager Login</h4>
              <p className="text-muted small">Access store dashboard, orders & menu controls</p>
            </div>

            {error && (
              <div className="alert alert-danger rounded-3 small mb-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control rounded-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hangout.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control rounded-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 py-3 rounded-pill fw-bold border-0 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    Sign In to Dashboard <i className="bi bi-box-arrow-in-right ms-2"></i>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 bg-light rounded-3 text-center small text-muted">
              <strong>Default Demo Admin:</strong><br />
              Email: <code>admin@hangout.com</code> | Password: <code>admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
