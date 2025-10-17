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

  // Format category name for display
  const formatCategoryName = (slug) => {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get category-specific background image
  const getCategoryImage = (slug) => {
    const categoryImages = {
      'electronics': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2042&q=80',
      'tech': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2042&q=80',
      'technology': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2042&q=80',
      'clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'fashion': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2012&q=80',
      'home-garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80',
      'books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2028&q=80',
      'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'toys': 'https://images.unsplash.com/photo-1558877385-1c2d7b8b7c3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'automotive': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'default': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
    };
    return categoryImages[slug] || categoryImages['default'];
  };

  return (
    
    <div className="container mt-4">
      <div
        className="mb-5 rounded position-relative overflow-hidden"
        style={{
          backgroundImage: `url('${getCategoryImage(slug)}')`,
          height: '250px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '2rem',
          textShadow: '2px 2px 5px rgba(0,0,0,0.7)',
        }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
            borderRadius: '1rem'
          }}
        />
        <div className="position-relative text-center">
          <h1 className="display-4 fw-bold mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {formatCategoryName(slug)}
          </h1>
          <p className="lead mb-0" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
            {products.length} Products Available
          </p>
        </div>
      </div>
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
