import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { CartContext } from '../components/CartContext';
import { WishlistContext } from '../components/WishlistContext';
import { useNavigate, useLocation } from 'react-router-dom';



const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatingHeart, setAnimatingHeart] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    api.get(`products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}>📦</div>
            <h3 className="fw-bold mb-3">Product Not Found</h3>
            <p className="text-muted mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Browse All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <div className="container mt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button 
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate('/')}
              >
                Home
              </button>
            </li>
            <li className="breadcrumb-item">
              <button 
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate('/products')}
              >
                Products
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="container py-4">
        <div className="row g-5">
          {/* Left Side: Image Gallery */}
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="product-image-section"
            >
              <div className="main-image-container position-relative">
                <div 
                  className="main-image-wrapper rounded-4 overflow-hidden shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    padding: '2rem',
                    minHeight: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                    style={{ 
                      maxHeight: '450px', 
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Enhanced Heart button with animation */}
                <motion.button
                  className={`heart-btn position-absolute ${isInWishlist(product.id) ? '' : 'outline'} ${animatingHeart ? 'heart-animate' : ''}`}
                  style={{
                    top: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    fontSize: '1.5rem',
                    color: isInWishlist(product.id) ? '#e74c3c' : '#6c757d',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const token = localStorage.getItem('authToken');
                    if (!token) {
                      navigate('/login', { state: { from: location.pathname } });
                      return;
                    }
                    
                    const adding = !isInWishlist(product.id);
                    console.log('wishlist click (details) - adding:', adding, 'productId:', product.id);
                    
                    if (adding) {
                      setAnimatingHeart(true);
                      addToWishlist(product);
                      setTimeout(() => {
                        setAnimatingHeart(false);
                      }, 800);
                    } else {
                      removeFromWishlist(product.id);
                    }
                  }}
                  aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <i className={`bi ${isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'} ${animatingHeart ? 'heart-pop' : ''}`}></i>
                  {animatingHeart && (
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
              </div>
            </motion.div>
          </div>

          {/* Right Side: Product Details */}
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="product-info"
            >
              {/* Product Title */}
              <motion.h1 
                className="product-title fw-bold mb-3"
                style={{ 
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  lineHeight: '1.2',
                  color: '#2c3e50'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {product.name}
              </motion.h1>

              {/* Price */}
              <motion.div 
                className="price-section mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span 
                  className="current-price fw-bold text-primary"
                  style={{ fontSize: '2.5rem' }}
                >
                  ₹{product.price.toLocaleString()}
                </span>
                <div className="mt-2">
                  <span className="badge bg-success px-3 py-2">
                    <i className="bi bi-truck me-1"></i>
                    Free Shipping
                  </span>
                  <span className="badge bg-info px-3 py-2 ms-2">
                    <i className="bi bi-shield-check me-1"></i>
                    Secure Payment
                  </span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div 
                className="description-section mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h5 className="fw-semibold mb-3">Product Description</h5>
                <p className="text-muted lh-lg" style={{ fontSize: '1.1rem' }}>
                  {product.description}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div 
                className="features-section mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="row g-3">
                  <div className="col-6">
                    <div className="feature-item d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>Quality Assured</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="feature-item d-flex align-items-center">
                      <i className="bi bi-arrow-return-left text-info me-2"></i>
                      <span>Easy Returns</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="feature-item d-flex align-items-center">
                      <i className="bi bi-headset text-warning me-2"></i>
                      <span>24/7 Support</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="feature-item d-flex align-items-center">
                      <i className="bi bi-lightning-charge-fill text-danger me-2"></i>
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="action-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="d-grid gap-3">
                  <motion.button
                    className="btn btn-primary btn-lg"
                    style={{
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px rgba(13, 110, 253, 0.3)'
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 12px 35px rgba(13, 110, 253, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const token = localStorage.getItem('authToken');
                      if (!token) {
                        navigate('/login', { state: { from: location.pathname } });
                      } else {
                        addToCart(product);
                        navigate('/added-to-cart', { state: { product } });
                      }
                    }}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </motion.button>

                  <div className="row g-2">
                    <div className="col-6">
                      <motion.button
                        className="btn btn-outline-secondary w-100"
                        style={{ borderRadius: '12px', padding: '0.8rem' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/products')}
                      >
                        <i className="bi bi-arrow-left me-1"></i>
                        Back to Shop
                      </motion.button>
                    </div>
                    <div className="col-6">
                      <motion.button
                        className="btn btn-outline-info w-100"
                        style={{ borderRadius: '12px', padding: '0.8rem' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: product.name,
                              text: product.description,
                              url: window.location.href,
                            });
                          }
                        }}
                      >
                        <i className="bi bi-share me-1"></i>
                        Share
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
