import { Link } from 'react-router-dom';
import '../styles/HomeBanner.css';

const HomeBanner = () => {
  return (
    <div className="hero-banner">
      {/* Animated Background */}
      <div className="hero-bg">
        <div className="hero-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <i className="bi bi-star-fill"></i>
            <span>Premium Quality</span>
          </div>
          <h1 className="hero-title">
            Welcome to <span className="brand-highlight">MyStore</span>
            <div className="title-decoration">
              <i className="bi bi-bag-heart"></i>
            </div>
          </h1>
          <p className="hero-subtitle">
            Discover amazing products with unbeatable prices and exceptional quality. 
            Your perfect shopping experience starts here.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-hero btn-primary">
              <i className="bi bi-shop"></i>
              <span>Shop Now</span>
              <div className="btn-shine"></div>
            </Link>
            <Link to="/about" className="btn-hero btn-secondary">
              <i className="bi bi-info-circle"></i>
              <span>Learn More</span>
            </Link>
          </div>
          <div className="hero-features">
            <div className="feature">
              <i className="bi bi-truck"></i>
              <span>Free Shipping</span>
            </div>
            <div className="feature">
              <i className="bi bi-shield-check"></i>
              <span>Secure Payment</span>
            </div>
            <div className="feature">
              <i className="bi bi-arrow-clockwise"></i>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
