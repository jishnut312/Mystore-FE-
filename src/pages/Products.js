import React, { useEffect, useState, useContext, useRef } from 'react';
import api from '../api';
import { CartContext } from '../components/CartContext';
import { WishlistContext } from '../components/WishlistContext';
import { Link } from 'react-router-dom'; // make sure this is imported
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatingHearts, setAnimatingHearts] = useState(new Set());
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    api.get('products/')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-4">Loading products...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <div
        className="mb-5 rounded"
        style={{
          backgroundImage: "url('/images/product.jpg')",
          height: '300px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '2rem',
          textShadow: '2px 2px 5px rgba(0,0,0,0.5)',
        }}
      >All Products
      </div>

      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm product-card">
              <div className="image-wrapper">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.title || product.name || 'Product Image'}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                </Link>

                {/* Enhanced Heart button with animation */}
                <button
                className={`heart-btn ${isInWishlist(product.id) ? '' : 'outline'} ${animatingHearts.has(product.id) ? 'heart-animate' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  const adding = !isInWishlist(product.id);
                  console.log('wishlist click (products) - adding:', adding, 'productId:', product.id);
                  
                  if (adding) {
                    // Trigger animation for adding to wishlist
                    setAnimatingHearts(prev => new Set([...prev, product.id]));
                    addToWishlist(product);
                    
                    // Remove animation state after animation completes
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
                </button>
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title" title={product.title || product.name}>
                  {product.title?.length > 30
                    ? product.title.slice(0, 27) + '...'
                    : product.title}
                </h5>
                <p className="card-text text-success fw-bold mb-2">
                  ₹ {(Number(product.price) || 0).toFixed(2)}
                </p>
                <div className="d-flex gap-2 mt-auto">
                  <button
                    className="btn btn-sm btn-outline-primary flex-fill"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
