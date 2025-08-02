import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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
      <div className="container mt-5">

        {/* ✅ Banner Section */}
        <div
          className="text-white d-flex align-items-center mb-5"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/homepage.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80vh',
            borderRadius: '12px',
            padding: '3rem'
          }}
        >
          <div className="container">
            <h1 className="display-4 fw-bold animate__animated animate__fadeInDown">
              Welcome to MyStore 🛍️
            </h1>
            <p className="lead mt-3">
              {user ? `Hello, ${user}! Ready to shop?` : 'Explore the best products picked just for you.'}
            </p>
            <Link to="/products" className="btn btn-light btn-lg mt-3">
              Browse Products
            </Link>
          </div>
        </div>
        

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
      </div>
    </div>
  );
};

export default Home;
