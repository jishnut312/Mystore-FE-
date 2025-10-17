import React, { useEffect, useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { CartContext } from '../components/CartContext';
import { WishlistContext } from '../components/WishlistContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatingHearts, setAnimatingHearts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    api.get('products/')
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  // Handle URL search parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product =>
      (product.name || product.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'name':
        default:
          return (a.name || a.title || '').localeCompare(b.name || b.title || '');
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading amazing products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}>⚠️</div>
            <h3 className="fw-bold mb-3">Oops! Something went wrong</h3>
            <p className="text-muted mb-4">{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Search and Filter Section */}
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="search-filter-section mb-5"
        >
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="search-box position-relative">
                <i className="bi bi-search position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}></i>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: '45px',
                    borderRadius: '50px',
                    border: '2px solid #e9ecef',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-lg"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ borderRadius: '50px', border: '2px solid #e9ecef' }}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="results-info text-center">
                
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence>
          {filteredProducts.length > 0 ? (
            <div className="row g-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="col-6 col-md-4 col-lg-3"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
                >
                  <motion.div 
                    className="product-card h-100"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      <div className="image-wrapper position-relative overflow-hidden">
                        <Link to={`/products/${product.id}`}>
                          <motion.img
                            src={product.image}
                            alt={product.title || product.name || 'Product Image'}
                            className="card-img-top w-100"
                            style={{ 
                              height: '220px', 
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            whileHover={{ scale: 1.1 }}
                          />
                        </Link>

                        {/* Enhanced Heart button */}
                        <motion.button
                          className={`heart-btn position-absolute ${isInWishlist(product.id) ? '' : 'outline'} ${animatingHearts.has(product.id) ? 'heart-animate' : ''}`}
                          style={{
                            top: '15px',
                            right: '15px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            fontSize: '1.2rem',
                            color: isInWishlist(product.id) ? '#e74c3c' : '#6c757d',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const adding = !isInWishlist(product.id);
                            console.log('wishlist click (products) - adding:', adding, 'productId:', product.id);
                            
                            if (adding) {
                              setAnimatingHearts(prev => new Set([...prev, product.id]));
                              addToWishlist(product);
                              setTimeout(() => {
                                setAnimatingHearts(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(product.id);
                                  return newSet;
                                });
                              }, 800);
                            } else {
                              removeFromWishlist(product.id);
                            }
                          }}
                          aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                          title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <i className={`bi ${isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'} ${animatingHearts.has(product.id) ? 'heart-pop' : ''}`}></i>
                          {animatingHearts.has(product.id) && (
                            <span className="burst">
                              <span className="dot d1"></span>
                              <span className="dot d2"></span>
                              <span className="dot d3"></span>
                              <span className="dot d4"></span>
                              <span className="dot d5"></span>
                              <span className="dot d6"></span>
                            </span>
                          )}
                        </motion.button>

                        {/* Quick View Overlay */}
                        <div 
                          className="quick-view-overlay position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{
                            background: 'rgba(0,0,0,0.7)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            top: 0,
                            left: 0
                          }}
                        >
                          <Link 
                            to={`/products/${product.id}`}
                            className="btn btn-light btn-sm"
                            style={{ borderRadius: '50px' }}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Quick View
                          </Link>
                        </div>
                      </div>

                      <div className="card-body p-4 d-flex flex-column">
                        <h5 
                          className="card-title fw-semibold mb-2"
                          title={product.title || product.name}
                          style={{ 
                            fontSize: '1.1rem',
                            lineHeight: '1.3',
                            height: '2.6rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {product.title || product.name}
                        </h5>
                        
                        <div className="price-section mb-3">
                          <span 
                            className="current-price fw-bold text-primary"
                            style={{ fontSize: '1.3rem' }}
                          >
                            ₹{(Number(product.price) || 0).toLocaleString()}
                          </span>
                        </div>

                        <div className="mt-auto">
                          <motion.button
                            className="btn btn-primary w-100"
                            style={{
                              borderRadius: '50px',
                              padding: '0.7rem 1.5rem',
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              addToCart(product);
                              // Optional: Show toast notification
                            }}
                          >
                            <i className="bi bi-cart-plus me-2"></i>
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-5"
            >
              <div className="empty-results">
                <div className="mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}>🔍</div>
                <h3 className="fw-bold mb-3">No Products Found</h3>
                <p className="text-muted mb-4">
                  We couldn't find any products matching "{searchQuery}". Try adjusting your search.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;
