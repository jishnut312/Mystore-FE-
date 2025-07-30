import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api';

const AddedToCart = () => {
  const location = useLocation();
  const addedProduct = location.state?.product;

  const [otherProducts, setOtherProducts] = useState([]);

  useEffect(() => {
    // Fetch all products (or similar ones)
    api.get('products/')
      .then(res => setOtherProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      {/* Success Message */}
      {addedProduct && (
        <div className="alert alert-success text-center">
          ✅ <strong>{addedProduct.name}</strong> has been added to your cart!
        </div>
      )}

      {/* Action Buttons */}
      <div className="text-center mb-5">
        <Link to="/cart" className="btn btn-success me-3">View Cart</Link>
        <Link to="/" className="btn btn-outline-primary">Continue Shopping</Link>
      </div>

      {/* Suggested Products */}
      <h3 className="mb-4 text-center">You May Also Like</h3>
      <div className="row">
        {otherProducts
          .filter(p => p.id !== addedProduct?.id)
          .slice(0, 4) // Limit to 4
          .map(product => (
            <div key={product.id} className="col-md-3 mb-4">
              <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="text-success fw-bold">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddedToCart;
