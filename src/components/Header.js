import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { CartContext } from '../components/CartContext';
import { WishlistContext } from './WishlistContext';
import '../styles/Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [animateCart, setAnimateCart] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      setAnimateCart(false); // Reset
      requestAnimationFrame(() => {
        setAnimateCart(true); // Re-trigger
      });

      const timeout = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [cartItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://mystore-be.onrender.com/api/categories/');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light modern-navbar shadow-sm">
      <div className="container position-relative">
        {/* Brand */}
        <Link className="navbar-brand modern-brand fw-bold me-3" to="/">
          <i className="bi bi-bag-heart me-2"></i>
          MyStore
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enhanced Search - Only on Home Page */}
        {isHome && (
          <form
            className="d-none d-lg-flex position-absolute start-50 translate-middle-x modern-search"
            onSubmit={handleSearch}
            style={{ width: '350px' }}
          >
            <div className="search-container">
              <i className="bi bi-search search-icon"></i>
              <input
                className="form-control search-input"
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn search-btn" type="submit">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </form>
        )}

        {/* Nav items */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Mobile Search - Only on Home Page */}
          {isHome && (
            <form
              className="d-lg-none mb-3 mt-2"
              onSubmit={handleSearch}
            >
              <div className="search-container">
                <i className="bi bi-search search-icon"></i>
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn search-btn" type="submit">
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </form>
          )}

          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2 mt-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
           
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
           

            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle cursor-pointer"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </span>
              <ul className="dropdown-menu">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.id}>
                      <Link className="dropdown-item" to={`/category/${category.slug}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li><span className="dropdown-item text-muted">Loading...</span></li>
                )}
              </ul>
            </li>
          </ul>

          {/* Right side: Auth & Icons */}
          <div className="d-flex align-items-center ms-auto mt-2 mt-lg-0 gap-3">
            {/* Profile/Login */}
            {user ? (
              <div className="dropdown" ref={dropdownRef}>
                <div
                  className="d-flex align-items-center dropdown-toggle cursor-pointer profile-wrapper"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <i className="bi bi-person-circle fs-5 text-primary me-2"></i>
                  <span className="username-text d-none d-md-inline">{user.username || user}</span>
                </div>

                {showDropdown && (
                  <div className="dropdown-menu dropdown-menu-end show mt-2">
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to logout?')) {
                          logout();
                        }
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn btn-sm btn-outline-primary" to="/login">Login</Link>
                <Link className="btn btn-sm btn-primary" to="/register">Register</Link>
              </div>
            )}

            {/* Action Icons */}
            {user && (
              <div className="d-flex align-items-center gap-2">
                {/* Wishlist */}
                <Link to="/wishlist" className="icon-wrapper wishlist-icon">
                  <i className="bi bi-heart"></i>
                  <span className="icon-tooltip">Wishlist</span>
                </Link>

                {/* Cart */}
                <Link to="/cart" className="icon-wrapper cart-icon position-relative">
                  <i className={`bi bi-cart ${animateCart ? 'cart-animate' : ''}`}></i>
                  {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                  )}
                  <span className="icon-tooltip">Cart</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
