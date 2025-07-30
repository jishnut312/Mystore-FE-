import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <AuthProvider>
   <CartProvider>
    <App />
  </CartProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
