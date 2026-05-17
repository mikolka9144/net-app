import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Stats from './pages/Stats';

export default function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <Link to="/">Home</Link> | <Link to="/products">Products</Link> | <Link to="/stats">Stats</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </div>
  );
}
