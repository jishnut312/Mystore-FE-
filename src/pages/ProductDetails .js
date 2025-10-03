import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
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

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!product) return <p className="text-center mt-5">Product not found.</p>;

  return (
    <div className="container mt-5">
      <div
        className="row align-items-center"
        style={{ minHeight: '70vh' }} // ensures consistent height
      >
        {/* Left Side: Image with wishlist heart overlay */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <div className="image-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />

            {/* Enhanced Heart button with animation */}
            <button
              className={`heart-btn ${isInWishlist(product.id) ? '' : 'outline'} ${animatingHeart ? 'heart-animate' : ''}`}
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
                  // Trigger animation for adding to wishlist
                  setAnimatingHeart(true);
                  addToWishlist(product);
                  
                  // Remove animation state after animation completes
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
            </button>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p className="mb-3">{product.description}</p>
          <p className="fw-bold fs-4 text-success">₹{product.price}</p>

          {/* Add to Cart Button */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
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
              Add to Cart
            </button>

            {/* Wishlist is handled via heart overlay on the image */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
