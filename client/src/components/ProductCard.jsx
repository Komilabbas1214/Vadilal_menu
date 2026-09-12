import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!product.available) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
        <span className="category-tag">{product.category}</span>
        <span className="price-badge">₹{product.price}</span>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h5 className="mb-0 text-dark fw-bold text-truncate" title={product.name}>
            {product.name}
          </h5>
        </div>

        <p className="text-muted small mb-2 text-truncate-2" style={{ minHeight: '36px', fontSize: '0.85rem' }}>
          {product.description || `${product.flavour} flavoured ice cream.`}
        </p>

        <div className="d-flex align-items-center justify-content-between text-secondary mb-3 small">
          <span><i className="bi bi-box-seam me-1"></i> {product.size}</span>
          <span><i className="bi bi-palette me-1"></i> {product.flavour}</span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="badge bg-light text-muted fw-normal border">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          {product.available ? (
            <button
              className={`btn w-100 rounded-pill fw-bold border-0 transition-all ${
                added ? 'btn-success' : 'btn-pink text-white'
              }`}
              style={{
                background: added
                  ? '#2ec4b6'
                  : 'linear-gradient(135deg, #ff477e 0%, #ff70a6 100%)',
              }}
              onClick={handleAdd}
            >
              {added ? (
                <>
                  <i className="bi bi-check-circle-fill me-1"></i> Added!
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-1"></i> Add to Cart
                </>
              )}
            </button>
          ) : (
            <button className="btn btn-secondary w-100 rounded-pill fw-bold" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
