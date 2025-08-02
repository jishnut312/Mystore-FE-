import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { CartContext } from '../components/CartContext';

const stripePromise = loadStripe('pk_test_51RH0Rd092l9kogJbhbxd4e6d9QFkXWfJYEtFBCtw2b3raKyjWpu5PepFVZWRb1OiislzKQlo43gZNNW7UdrflV1600bOytOxBZ'); // Test key

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const [pincode, setPincode] = useState('');
  const [isPincodeValid, setIsPincodeValid] = useState(null);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    house: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.warn('User not authenticated');
      return;
    }

    axios.get('http://localhost:8000/api/orders/user/address/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(res => {
        if (res.data) {
          setAddress(prev => ({ ...prev, ...res.data }));
          setPincode(res.data.pincode || '');
        }
      })
      .catch(err => console.error('No saved address:', err));
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    const serviceable = ['670001', '560001', '110001', '670307'];
    setIsPincodeValid(serviceable.includes(pincode));
  };

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

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (isPincodeValid === false) {
      alert("Delivery not available to this pincode.");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("You're not logged in.");
        return;
      }

      await axios.post(
        'http://localhost:8000/api/orders/user/save-address/',
        { ...address, pincode },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Address saved successfully.");

      // Proceed to Stripe checkout
      await handleCheckout();

    } catch (error) {
      console.error("Error placing order", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Delivery Address</h3>
      <form onSubmit={handleOrderSubmit}>
        <input
          type="text"
          name="fullName"
          value={address.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="form-control mb-2"
        />
        <input
          type="text"
          name="phone"
          value={address.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="form-control mb-2"
        />

        <div className="d-flex mb-2">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
          <button type="button" className="btn btn-outline-primary" onClick={handlePincodeCheck}>
            Check
          </button>
        </div>
        {isPincodeValid === true && <p className="text-success">Delivery available ✅</p>}
        {isPincodeValid === false && <p className="text-danger">Delivery not available ❌</p>}

        <input
          type="text"
          name="house"
          value={address.house}
          onChange={handleChange}
          placeholder="House No, Street"
          required
          className="form-control mb-2"
        />
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleChange}
          placeholder="City"
          required
          className="form-control mb-2"
        />
        <select
          name="state"
          value={address.state}
          onChange={handleChange}
          required
          className="form-control mb-3"
        >
          <option value="">Select State</option>
          <option value="Kerala">Kerala</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
          <option value="Gujarat">Gujarat</option>
          <option value="West Bengal">West Bengal</option>
        </select>

        <button className="btn btn-success" disabled={isPincodeValid === false}>
          Place Order & Pay
        </button>
      </form>
    </div>
  );
};

export default Checkout;
