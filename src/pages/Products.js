import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { CartContext } from '../components/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);


  useEffect(() => {
    api.get('products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      
      <h2>All Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <img src={`${product.image}`} alt={product.title} width="150" />
            <h4>{product.title}</h4>
            <p>{product.price} ₹</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
