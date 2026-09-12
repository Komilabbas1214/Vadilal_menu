import React, { useState, useEffect } from 'react';
import API from '../services/api';

const categories = [
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
];

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Scoops',
    description: '',
    flavour: '',
    size: '1 Scoop (100ml)',
    price: '',
    image: '',
    ingredients: '',
    tags: '',
    available: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Scoops',
      description: '',
      flavour: '',
      size: '1 Scoop (100ml)',
      price: '',
      image: '',
      ingredients: '',
      tags: '',
      available: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p._id);
    setFormData({
      name: p.name,
      category: p.category,
      description: p.description || '',
      flavour: p.flavour,
      size: p.size || '',
      price: p.price,
      image: p.image || '',
      ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(', ') : p.ingredients || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
      available: p.available,
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
      } else {
        await API.post('/products', formData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      await API.put(`/products/${product._id}`, { available: !product.available });
      fetchProducts();
    } catch (err) {
      alert('Failed to update availability');
    }
  };

  return (
    <div className="container-fluid max-width-1400 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Menu Inventory Management</h2>
          <p className="text-muted mb-0 small">Add, edit prices, or change product availability</p>
        </div>

        <button className="btn btn-pink text-white rounded-pill px-4 fw-bold shadow-sm" onClick={handleOpenAdd}>
          <i className="bi bi-plus-circle me-2"></i> Add New Item
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="py-3 ps-4">Image</th>
                <th className="py-3">Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Flavour & Size</th>
                <th className="py-3">Price</th>
                <th className="py-3">Stock Status</th>
                <th className="py-3 pe-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No products in database. Click "Add New Item" to create one.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td className="ps-4">
                      <img
                        src={p.image || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100'}
                        alt={p.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{p.name}</div>
                      <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>
                        {p.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-pink border border-pink-subtle">
                        {p.category}
                      </span>
                    </td>
                    <td className="small">
                      <div><strong>Flavour:</strong> {p.flavour}</div>
                      <div className="text-muted"><strong>Size:</strong> {p.size}</div>
                    </td>
                    <td className="fw-bold fs-6">₹{p.price}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={p.available}
                          onChange={() => handleToggleAvailability(p)}
                        />
                        <label className="form-check-label small fw-semibold">
                          {p.available ? (
                            <span className="text-success">Available</span>
                          ) : (
                            <span className="text-danger">Out of Stock</span>
                          )}
                        </label>
                      </div>
                    </td>
                    <td className="pe-4 text-center">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill me-1"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => handleDeleteProduct(p._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-dark text-white rounded-top-4">
                <h5 className="modal-title fw-bold">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSaveProduct}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Flavour *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.flavour}
                        onChange={(e) => setFormData({ ...formData, flavour: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Size / Portion *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 1 Scoop (100ml) or 500ml Tub"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Price (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        min="0"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Tags (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="chocolate, bestseller, eggless"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Ingredients (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Cocoa, Milk, Cream"
                        value={formData.ingredients}
                        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4">
                  <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-pink text-white rounded-pill px-4 fw-bold">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
