import React, { useContext, useState } from 'react';
import { CartContext } from '../components/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Cart.css';



const Cart = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useContext(CartContext);

  const stripePromise = loadStripe('pk_test_51RH0Rd092l9kogJbhbxd4e6d9QFkXWfJYEtFBCtw2b3raKyjWpu5PepFVZWRb1OiislzKQlo43gZNNW7UdrflV1600bOytOxBZ'); // Test key

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to paisa
      },
      quantity: item.quantity,
    }));

console.log("Sending line items to Stripe:", JSON.stringify(line_items, null, 2));

    try {
      const response = await fetch('https://mystore-be.onrender.com/api/orders/create-checkout-session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: line_items }),
      });

      const session = await response.json();

      if (session.id) {
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        if (result.error) {
          console.error("Stripe redirect error:", result.error.message);
        }
      } else {
        console.error("No session ID returned from backend:", session.error || session);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };


  // Enhanced remove function with animation
  const handleRemoveItem = (itemId) => {
    setRemovingItems(prev => new Set([...prev, itemId]));
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="empty-cart-container">
              <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
              <h2 className="mb-3 text-muted">Your Cart is Empty</h2>
              <p className="text-muted mb-4">
                Looks like you haven't added any items to your cart yet. 
                Start shopping to fill it up!
              </p>
              <Link to="/products" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-shop me-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const handleProceed = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/user/has-address/');

      if (res.data.has_address) {
        // User already has address, skip checkout page
        handleCheckout(); // send to Stripe or order placement directly
      } else {
        // No address found, go to Checkout page
        navigate('/checkout');
      }
    } catch (err) {
      console.error("Failed to check address", err);
      // fallback to checkout
      navigate('/checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const totalAmount = subtotal + shipping + tax;

  return (
    <div className="cart-page">
      <div className="container mt-4">
        {/* Header Section */}
        <div className="cart-header mb-4">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="mb-0">
                <i className="bi bi-cart3 text-primary me-2"></i>
                Shopping Cart
              </h2>
              <p className="text-muted mb-0">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-outline-danger" 
                onClick={clearCart}
                title="Clear all items"
              >
                <i className="bi bi-trash me-1"></i>
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item ${removingItems.has(item.id) ? 'removing' : ''}`}
                >
                  <div className="item-image">
                    <img src={item.image} alt={item.title || item.name} />
                  </div>
                  
                  <div className="item-details">
                    <h5 className="item-title">{item.title || item.name}</h5>
                    <p className="item-price">₹{item.price}</p>
                    
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQty(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQty(item.id)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-total">
                    <div className="total-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove item"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Continue Shopping */}
            <div className="continue-shopping mt-4">
              <Link to="/products" className="btn btn-outline-primary">
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary">
              <h4 className="summary-title">Order Summary</h4>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-success' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              {shipping === 0 && (
                <div className="free-shipping-notice">
                  <i className="bi bi-truck text-success me-2"></i>
                  <small className="text-success">Free shipping on orders over ₹500!</small>
                </div>
              )}
              
              <hr />
              
              <div className="summary-total">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <button
                className="checkout-btn"
                onClick={handleProceed}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-credit-card me-2"></i>
                    Proceed to Checkout
                  </>
                )}
              </button>
              
              <div className="secure-checkout">
                <i className="bi bi-shield-check text-success me-2"></i>
                <small className="text-muted">Secure checkout guaranteed</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
