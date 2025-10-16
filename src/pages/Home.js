import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Parallax } from 'react-parallax';
import axios from 'axios';
import '../styles/FullScreenHero.css';

const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

const Home = () => {
  const { user } = useContext(AuthContext);
  const [randomProducts, setRandomProducts] = useState([]);
  const [slideshowProducts, setSlideshowProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('https://mystore-be.onrender.com/api/products/')
      .then(res => {
        const shuffled = shuffleArray(res.data);
        setRandomProducts(shuffled.slice(0, 4));
        setSlideshowProducts(shuffled.slice(0, 8));
      })
      .catch(err => console.log(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    axios.get(`https://mystore-be.onrender.com/api/products/?search=${searchQuery}`)
      .then(res => setSearchResults(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (slideshowProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideshowProducts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [slideshowProducts.length]);

  return (
    <div className="page-wrapper">
      {/* 🌟 Full-Screen Hero Parallax Section */}
      <Parallax
        bgImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        strength={400}
        className="full-screen-hero"
      >
        <div 
          className="hero-overlay d-flex align-items-center justify-content-center text-center text-white"
          style={{
            height: '100vh',
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
            position: 'relative'
          }}
        >
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="hero-content"
            >
              <motion.h1 
                className="display-2 fw-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)'
                }}
              >
                Welcome to MyStore 🛍️
              </motion.h1>
              
              <motion.p 
                className="lead mb-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                style={{ 
                  fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  maxWidth: '600px',
                  margin: '0 auto 2rem'
                }}
              >
                {user 
                  ? `Hello, ${user}! Discover amazing products at unbeatable prices.` 
                  : 'Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.'
                }
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="hero-buttons"
              >
                <Link 
                  to="/products" 
                  className="btn btn-light btn-lg me-3 mb-3"
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '50px',
                    boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Shop Now
                </Link>
                <Link 
                  to="/products" 
                  className="btn btn-outline-light btn-lg mb-3"
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '50px',
                    borderWidth: '2px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Browse Categories
                </Link>
              </motion.div>
              
              {/* Scroll Down Indicator */}
             
            </motion.div>
          </div>
        </div>
      </Parallax>

      <div className="container mt-5">
        

        {/* ✅ Featured Products Slideshow */}
        <div className="mb-5">
          <h3 className="mb-4 text-center">Featured Products</h3>

          <div className="position-relative mb-5 slideshow-wrapper">
            <Link
              to={`/products/${slideshowProducts[currentSlide]?.id}`}
              className="btn btn-lg"
            >
              <AnimatePresence mode="wait">
                {slideshowProducts.length > 0 && (
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="position-absolute w-100 h-100"
                  >
                    <div className="card h-100 shadow-lg rounded-4 overflow-hidden">
                      <div className="row g-0 h-100">
                        <div className="col-md-6 d-flex align-items-center">
                          <img
                            src={slideshowProducts[currentSlide].image}
                            className="img-fluid rounded-start"
                            alt={slideshowProducts[currentSlide].title}
                            style={{
                              width: '100%',
                              height: '400px',
                              objectFit: 'contain',
                              backgroundColor: '#f8f9fa',
                              padding: '20px'
                            }}
                          />
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                          <div className="card-body p-5">
                            <h2
                              className="fs-3 fw-semibold mb-3 text-uppercase"
                              style={{
                                color: '#343a40',
                                letterSpacing: '0.5px',
                                fontFamily: 'Poppins, sans-serif'
                              }}
                            >
                              {slideshowProducts[currentSlide]?.name}
                            </h2>
                            <p
                              className="fs-1 fw-bold mb-0"
                              style={{
                                color: '#e63946',
                                fontFamily: 'Poppins, sans-serif',
                                textShadow: '1px 1px 1px rgba(0,0,0,0.1)'
                              }}
                            >
                              ₹{slideshowProducts[currentSlide]?.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* ✅ Slideshow Navigation Dots */}
            <div className="d-flex justify-content-center mt-3">
              {slideshowProducts.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`btn btn-sm mx-1 ${currentSlide === index ? 'btn-primary' : 'btn-outline-primary'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Full-Screen Quality Products Parallax Section */}
        <Parallax
          bgImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          strength={300}
          className="full-screen-quality mb-5"
        >
          <div 
            className="text-white d-flex align-items-center justify-content-center text-center"
            style={{
              height: '100vh',
              background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7))',
              position: 'relative'
            }}
          >
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="quality-content"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-4"
                >
                  <span 
                    className="badge bg-light text-dark px-4 py-2 mb-4"
                    style={{ 
                      fontSize: '1rem', 
                      borderRadius: '50px',
                      fontWeight: '500',
                      letterSpacing: '1px'
                    }}
                  >
                    PREMIUM COLLECTION
                  </span>
                </motion.div>
                
                <motion.h1 
                  className="display-1 fw-bold mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                    fontSize: 'clamp(3rem, 10vw, 6rem)',
                    lineHeight: '1.1'
                  }}
                >
                  Quality Products
                </motion.h1>
                
                <motion.p 
                  className="lead mb-5"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  style={{ 
                    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                    maxWidth: '800px',
                    margin: '0 auto 3rem',
                    lineHeight: '1.4'
                  }}
                >
                  Discover our carefully curated collection of premium products. 
                  Every item is handpicked for quality, durability, and style. 
                  Experience the difference that quality makes.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="quality-features mb-5"
                >
                  <div className="row justify-content-center">
                    <div className="col-md-4 mb-3">
                      <div className="feature-item">
                        <div className="mb-2" style={{ fontSize: '2.5rem' }}>✨</div>
                        <h5 className="fw-bold">Premium Quality</h5>
                        <p className="mb-0">Handpicked for excellence</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="feature-item">
                        <div className="mb-2" style={{ fontSize: '2.5rem' }}>🛡️</div>
                        <h5 className="fw-bold">Guaranteed</h5>
                        <p className="mb-0">100% satisfaction promise</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="feature-item">
                        <div className="mb-2" style={{ fontSize: '2.5rem' }}>🚀</div>
                        <h5 className="fw-bold">Fast Delivery</h5>
                        <p className="mb-0">Quick & secure shipping</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="quality-buttons"
                >
                  <Link 
                    to="/products" 
                    className="btn btn-light btn-lg me-3 mb-3"
                    style={{
                      padding: '1rem 2.5rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '50px',
                      boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      minWidth: '200px'
                    }}
                  >
                    Explore Collection
                  </Link>
                  <Link 
                    to="/products?featured=true" 
                    className="btn btn-outline-light btn-lg mb-3"
                    style={{
                      padding: '1rem 2.5rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '50px',
                      borderWidth: '2px',
                      transition: 'all 0.3s ease',
                      minWidth: '200px'
                    }}
                  >
                    Featured Items
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Parallax>

        {/* ✅ Random Products Section */}
        <h3 className="mb-4 text-center">You May Like</h3>
        <div className="row">
          {randomProducts.map((product) => (
            <motion.div
              key={product.id}
              className="col-6 col-md-4 col-lg-3 mb-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm rounded-3">
                  <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    padding: '10px'
                  }}>
                    <img
                      src={product.image}
                      className="img-fluid"
                      alt={product.title}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-truncate">{product.description}</p>
                    <p className="fw-bold">₹{product.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Final Statistics Parallax Section */}
        <Parallax
          bgImage="https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          strength={150}
          className="mt-5"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        >
          <div 
            className="text-white d-flex align-items-center justify-content-center text-center"
            style={{
              height: '60vh',
              background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7))',
              padding: '3rem'
            }}
          >
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="display-5 fw-bold mb-4">Join Thousands of Happy Customers</h2>
                <div className="row">
                  <div className="col-6 col-md-3">
                    <div className="mb-3">
                      <h3 className="display-4 fw-bold">10K+</h3>
                      <p className="lead">Happy Customers</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="mb-3">
                      <h3 className="display-4 fw-bold">500+</h3>
                      <p className="lead">Products</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="mb-3">
                      <h3 className="display-4 fw-bold">50+</h3>
                      <p className="lead">Categories</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="mb-3">
                      <h3 className="display-4 fw-bold">24/7</h3>
                      <p className="lead">Support</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Parallax>
      </div>
    </div>
  );
};

export default Home;
