import React from 'react';
import { useWishlist } from '../components/WishlistContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="empty-wishlist-container p-5">
              <i className="bi bi-heart display-1 text-muted mb-4"></i>
              <h2 className="mb-3 text-muted">Your Wishlist is Empty</h2>
              <p className="text-muted mb-4">
                Discover amazing products and save your favorites here.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-search me-2"></i>
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="wishlist-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="mb-0">
              <i className="bi bi-heart-fill text-danger me-2"></i>
              My Wishlist
            </h2>
            <p className="text-muted mb-0">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
          </div>
          <div className="col-auto">
            <button 
              className="btn btn-outline-danger" 
              onClick={clearWishlist}
              title="Clear all items"
            >
              <i className="bi bi-trash me-1"></i>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="row g-4">
        {wishlistItems.map(item => (
          <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div className="wishlist-card card h-100 shadow-sm border-0">
              <div className="position-relative overflow-hidden">
                <Link to={`/products/${item.id}`} className="d-block">
                  <img 
                    src={item.image} 
                    alt={item.title || item.name} 
                    className="card-img-top wishlist-img" 
                  />
                </Link>
                <button 
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
                  title="Remove from wishlist"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="card-title mb-2 text-truncate" title={item.title || item.name}>
                  {item.title || item.name}
                </h6>
                <p className="text-success fw-bold fs-5 mb-3">₹{item.price}</p>
                <div className="mt-auto">
                  <Link 
                    to={`/products/${item.id}`} 
                    className="btn btn-primary w-100"
                  >
                    <i className="bi bi-eye me-1"></i>
                    View Details
                  </Link>
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
