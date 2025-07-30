import { Link } from 'react-router-dom';

const HomeBanner = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center text-white"
      style={{
        backgroundImage: `url('/images/banner.jpg')`,  // your banner image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '80vh',
        position: 'relative',
      }}
    >
      {/* Overlay for better text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
        <h1 className="display-4 fw-bold">Welcome to MyStore 🛍️</h1>
        <p className="lead mb-4">Find the best deals and top-quality products here.</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default HomeBanner;
