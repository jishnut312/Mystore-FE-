import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api'; // Your Axios instance
import { useCart } from '../components/CartContext';
import { Link } from 'react-router-dom';


const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!searchQuery) return;

    api.get('/products/')
      .then((res) => {
        const filtered = res.data.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  if (loading) return <p className="text-center mt-5">Searching...</p>;

  return (
    <div className="container mt-4">

      {/* 🔻 Banner section */}
      <div
        className="mb-5 rounded"
        style={{
          backgroundImage: "url('/images/search.jpg')",
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
      >
      </div>

      <h3>Search Results for: <em>{searchQuery}</em></h3>

      {results.length > 0 ? (
        <div className="row">
          {results.map(product => (
            <div className="col-md-4 mb-4" key={product.id}>
            <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">

              <div className="card h-100 shadow-sm">

                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-success fw-bold">₹{product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn btn-primary"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
                  </Link>
            </div>
      

          ))}
        </div>
      ) : (
        <p className="text-danger mt-4">No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
