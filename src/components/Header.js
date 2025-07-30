import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { CartContext } from '../components/CartContext';
import '../styles/Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
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
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
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
        const response = await fetch('http://localhost:8000/api/categories/');
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container position-relative">
        {/* Brand */}
        <Link className="navbar-brand fw-bold me-3" to="/">MyStore</Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Search */}
        {isHome && (
          <form
            className="d-none d-lg-flex position-absolute start-50 translate-middle-x"
            onSubmit={handleSearch}
            style={{ width: '300px' }}
          >
            <input
              className="form-control form-control-sm me-2"
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-sm btn-primary" type="submit">Search</button>
          </form>
        )}

        {/* Nav items */}
        <div className="collapse navbar-collapse" id="navbarContent">
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

          {/* Right side: Auth & Cart */}
          <div className="d-flex align-items-center ms-auto mt-2 mt-lg-0 position-relative ">
            {/* Profile/Login */}
            {user ? (
              <div className="dropdown text-end me-5 " ref={dropdownRef}>
                <div
  className="d-flex align-items-center dropdown-toggle cursor-pointer profile-wrapper pr"
  onClick={() => setShowDropdown(!showDropdown)}
>
  <i className="bi bi-person-circle fs-4 text-primary me-1"></i>
  <span className="username-text">{user.username || user}</span>
</div>

                {showDropdown && (
                  <div className="dropdown-menu dropdown-menu-end show mt-1">
                    <button className="dropdown-item text-danger" onClick={logout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link className="btn btn-sm btn-outline-primary me-2" to="/login">Login</Link>
                <Link className="btn btn-sm btn-primary me-2" to="/register">Register</Link>
              </>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="position-absolute top-0 end-0 mt-2 me-1 nav-link"
              style={{ zIndex: 1000 }}
            >
              <i id="cart-icon" className={`bi bi-cart fs-4 ${animateCart ? 'cart-animate' : ''}`}></i>
              {cartItems.length > 0 && (
                <span className="cart-badge badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
