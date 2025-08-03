import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../components/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';



const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
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

  // Dummy add to cart handler
  const handleAddToCart = () => {
    // TODO: Add product to cart (context, redux, API call etc.)
    alert(`Added "${product.title}" to cart!`);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!product) return <p className="text-center mt-5">Product not found.</p>;

  return (
    <div className="container mt-5">
      <div
        className="row align-items-center"
        style={{ minHeight: '70vh' }} // ensures consistent height
      >
        {/* Left Side: Image */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Right Side: Details */}
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p className="mb-3">{product.description}</p>
          <p className="fw-bold fs-4 text-success">₹{product.price}</p>

          {/* Add to Cart Button */}
  <button className='btn btn-primary '
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

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
