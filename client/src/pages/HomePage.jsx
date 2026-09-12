import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const categoriesList = [
  'All',
  'Scoops',
  'Sundaes',
  'Shakes',
  'Brownies',
  'Cakes',
  'Tubs',
  'Kulfi',
  'Bars / Novelties',
  'Party Packs',
];

const HomePage = ({ onOpenAI }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      if (selectedCategory !== 'All') {
        url += `?category=${encodeURIComponent(selectedCategory)}`;
      }
      const res = await API.get(url);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Unable to load ice cream menu. Please make sure the server is running!');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.flavour.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="pb-5">
      {/* Hero Section */}
      <div className="bg-white py-4 mb-4 border-bottom shadow-sm">
        <div className="container max-width-1200 text-center">
          <h1 className="display-6 fw-extrabold text-dark mb-2">
            Find Your Perfect Ice Cream 🍦
          </h1>
          <p className="text-muted fs-6 mb-4">
            Freshly scoops, artisanal sundaes & thickshakes delivered right to your table!
          </p>

          {/* Search Bar */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="input-group shadow-sm rounded-pill bg-light p-1 border">
                <span className="input-group-text border-0 bg-transparent ps-3 text-muted">
                  <i className="bi bi-search fs-5"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent shadow-none px-2"
                  placeholder="Search scoops, chocolate, mango, sundaes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="btn btn-link text-muted border-0 text-decoration-none pe-3"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-width-1200">
        {/* Category Pills Header */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="fw-bold mb-0 text-dark">Menu Categories</h5>
          <span className="small text-muted">{filteredProducts.length} Items</span>
        </div>

        {/* Scrollable Categories */}
        <div className="category-pills-scroll mb-4">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* AI Banner Prompt */}
        <div className="p-3 mb-4 rounded-4 text-white d-flex align-items-center justify-content-between gap-3 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7b2cbf 0%, #ff477e 100%)' }}
        >
          <div className="d-flex align-items-center gap-3">
            <span className="fs-1">🤖</span>
            <div>
              <h6 className="fw-bold mb-0 fs-5">Confused what to order?</h6>
              <p className="mb-0 small text-white-75">Ask AI in Hinglish or English for budget combos!</p>
            </div>
          </div>
          <button className="btn btn-light rounded-pill fw-bold text-purple px-4" onClick={onOpenAI}>
            Ask AI Assistant
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-pink" role="status" style={{ width: '3rem', height: '3rem' }}></div>
            <p className="mt-3 text-muted fw-semibold">Fetching menu from Hangout store...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4 p-4 text-center">
            <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2"></i>
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
            <div className="fs-1 mb-2">🍦</div>
            <h5 className="fw-bold text-dark">No products found</h5>
            <p className="text-muted">Try adjusting your search query or selecting another category.</p>
          </div>
        ) : (
          <div className="row g-3 g-md-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating AI Button */}
      <button className="btn-floating-ai" onClick={onOpenAI}>
        <i className="bi bi-robot fs-4"></i>
        <span>Ask AI 🍦</span>
      </button>
    </div>
  );
};

export default HomePage;
