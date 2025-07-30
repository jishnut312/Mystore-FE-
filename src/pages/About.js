import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <h2 className="mb-4">About Us</h2>
       <div
        className="mb-5 rounded"
        style={{
          backgroundImage: "url('/images/about.jpg')",
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
      <p>
        Welcome to <strong>MyStore</strong>! We are an online marketplace offering a wide range of products at the best prices.
        Our mission is to provide a seamless shopping experience for our customers, with reliable service and fast delivery.
      </p>
      <p>
        Whether you're looking for electronics, fashion, home essentials, or anything in between, we've got you covered.
      </p>
      <p>
        Thank you for choosing MyStore. Happy shopping!
      </p>
    </div>
  );
};

export default About;
