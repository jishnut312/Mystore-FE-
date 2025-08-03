import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { CartContext } from '../components/CartContext';
import { Link } from 'react-router-dom'; // make sure this is imported

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

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
            <div className="card h-100 shadow-sm">
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title || product.name || 'Product Image'}
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title" title={product.title || product.name}>
                  {product.title?.length > 30
                    ? product.title.slice(0, 27) + '...'
                    : product.title}
                </h5>
                <p className="card-text text-success fw-bold mb-2">
                  ₹ {(Number(product.price) || 0).toFixed(2)}
                </p>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
