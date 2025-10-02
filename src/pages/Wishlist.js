import React from 'react';
import { useWishlist } from '../components/WishlistContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>Your wishlist is empty</h3>
        <p>
          Browse products and add items to your wishlist.
        </p>
        <Link to="/products" className="btn btn-primary">View Products</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Wishlist</h3>
        <button className="btn btn-sm btn-outline-danger" onClick={clearWishlist}>Clear</button>
      </div>

      <div className="row">
        {wishlistItems.map(item => (
          <div key={item.id} className="col-12 col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <Link to={`/products/${item.id}`}>
                <img src={item.image} alt={item.title || item.name} className="card-img-top" style={{height: '200px', objectFit: 'cover'}} />
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.title || item.name}</h5>
                <p className="text-success fw-bold">₹{item.price}</p>
                <div className="mt-auto d-flex gap-2">
                  <Link to={`/products/${item.id}`} className="btn btn-sm btn-outline-primary flex-fill">View</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => removeFromWishlist(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
