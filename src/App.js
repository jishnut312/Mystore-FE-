import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductDetails from './pages/ProductDetails ';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import AddedToCart from './pages/AddedToCart';
import About from './pages/About';
import Checkout from './pages/Checkout';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
            <Header />

      <div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/added-to-cart" element={<AddedToCart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />





        </Routes>
      </div>
      
      <Footer />

    </Router>
  );
}

export default App;
