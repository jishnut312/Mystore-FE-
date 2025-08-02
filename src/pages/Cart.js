import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
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

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return <p className="text-center mt-5">Your cart is empty.</p>;
  }


  const handleProceed = async () => {
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
  }
};

  return (
    <div className="container mt-5">
      <div
        className="mb-5 rounded"
        style={{
          backgroundImage: "url('/images/cart.jpg')",
          height: '350px',
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
      >
        Cart
      </div>

      <ul className="list-group mb-4">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  marginRight: '15px',
                }}
              />
              <div>
                <h6 className="mb-1">{item.title}</h6>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => decreaseQty(item.id)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary ms-1"
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <span className="fw-bold me-3">
                ₹{item.price * item.quantity}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="btn btn-sm btn-outline-danger"
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between align-items-center">
        <h5>Total: ₹{totalAmount}</h5>
       <button onClick=  {handleProceed} className="btn btn-primary">Proceed to Checkout</button>

      </div>
    </div>
  );
};

export default Cart;
