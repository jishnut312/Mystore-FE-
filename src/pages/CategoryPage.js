// pages/CategoryPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(`https://mystore-be.onrender.com/api/products/category/${slug}/`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  return (
    
    <div className="container mt-4">
      <div
        className="mb-5 rounded"
        style={{
          backgroundImage: "url('/images/category.jpg')",
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
      <h3>Category: {slug}</h3>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <Link
                to={`/products/${product.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100">
                  <img
                    src={`https://mystore-be.onrender.com${product.image}`}
                    alt={product.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
