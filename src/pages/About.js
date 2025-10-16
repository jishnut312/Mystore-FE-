import React from 'react';
import { motion } from 'framer-motion';
import { Parallax } from 'react-parallax';
import { Link } from 'react-router-dom';
import '../styles/AboutPage.css';

const About = () => {
  const whyChooseUs = [
    {
      icon: "⚡",
      title: "Fast & Reliable",
      description: "Lightning-fast performance with 99.9% uptime guarantee"
    },
    {
      icon: "🔒",
      title: "Secure Shopping",
      description: "Advanced encryption and secure payment processing"
    },
    {
      icon: "🚚",
      title: "Quick Delivery",
      description: "Fast shipping with real-time tracking and updates"
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Round-the-clock customer service and assistance"
    }
  ];

  const values = [
    {
      icon: "🎯",
      title: "Customer First",
      description: "Every decision we make starts with our customers in mind"
    },
    {
      icon: "🚀",
      title: "Innovation",
      description: "Constantly evolving to provide the best shopping experience"
    },
    {
      icon: "🤝",
      title: "Trust",
      description: "Building lasting relationships through transparency and reliability"
    },
    {
      icon: "🌱",
      title: "Sustainability",
      description: "Committed to responsible business practices and environmental care"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "1000+", label: "Products" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <Parallax
        bgImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
        strength={300}
      >
        <div 
          className="hero-section d-flex align-items-center justify-content-center text-center text-white"
          style={{
            height: '70vh',
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))'
          }}
        >
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="display-3 fw-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                About MyStore
              </h1>
              <p className="lead mb-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)', maxWidth: '600px', margin: '0 auto' }}>
                Revolutionizing online shopping with quality products, exceptional service, and innovative technology
              </p>
            </motion.div>
          </div>
        </div>
      </Parallax>

      {/* Company Story Section */}
      <section className="py-5 bg-light company-story">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="display-5 fw-bold mb-4">Our Story</h2>
                <p className="lead mb-4">
                  Founded in 2020, MyStore began as a simple idea: to create an online marketplace that truly puts customers first. What started as a small team with big dreams has grown into a trusted platform serving thousands of happy customers worldwide.
                </p>
                <p className="mb-4">
                  We believe that shopping should be more than just a transaction—it should be an experience. That's why we've built our platform with cutting-edge technology, curated high-quality products, and assembled a team of passionate individuals who care about your satisfaction.
                </p>
                <p className="mb-4">
                  Today, we're proud to offer over 1,000 carefully selected products across multiple categories, all backed by our commitment to quality, affordability, and exceptional customer service.
                </p>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Our team working together"
                  className="img-fluid rounded shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center p-4 h-100 mission-vision-card"
              >
                <div className="mb-4" style={{ fontSize: '4rem' }}>🎯</div>
                <h3 className="fw-bold mb-3">Our Mission</h3>
                <p className="lead">
                  To democratize access to quality products by creating an inclusive, user-friendly platform that connects customers with the best deals and exceptional service.
                </p>
              </motion.div>
            </div>
            <div className="col-md-6 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-4 h-100 mission-vision-card"
              >
                <div className="mb-4" style={{ fontSize: '4rem' }}>🔮</div>
                <h3 className="fw-bold mb-3">Our Vision</h3>
                <p className="lead">
                  To become the world's most trusted and innovative e-commerce platform, setting new standards for customer experience and sustainable business practices.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-primary text-white stats-section">
        <div className="container">
          <div className="row text-center">
            {stats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3 mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="stat-item"
                >
                  <h2 className="display-4 fw-bold">{stat.number}</h2>
                  <p className="lead">{stat.label}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Our Values</h2>
            <p className="lead">The principles that guide everything we do</p>
          </motion.div>
          
          <div className="row">
            {values.map((value, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-4 bg-white rounded shadow-sm h-100 value-card"
                >
                  <div className="mb-3 value-icon" style={{ fontSize: '3rem' }}>{value.icon}</div>
                  <h4 className="fw-bold mb-3">{value.title}</h4>
                  <p>{value.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Why Choose MyStore?</h2>
            <p className="lead">What makes us the preferred choice for online shopping</p>
          </motion.div>
          
          <div className="row">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-4 bg-white rounded shadow-sm h-100 value-card"
                >
                  <div className="mb-3 value-icon" style={{ fontSize: '3rem' }}>{feature.icon}</div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p>{feature.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-5 bg-dark text-white cta-section">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="display-5 fw-bold mb-4">Ready to Start Shopping?</h2>
            <p className="lead mb-4">
              Join thousands of satisfied customers and discover amazing products at unbeatable prices.
            </p>
            <div className="cta-buttons">
              <Link 
                to="/products" 
                className="btn btn-primary btn-lg me-3"
                style={{ borderRadius: '50px', padding: '1rem 2.5rem' }}
              >
                Shop Now
              </Link>
              <Link 
                to="/contact" 
                className="btn btn-outline-light btn-lg"
                style={{ borderRadius: '50px', padding: '1rem 2.5rem' }}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
