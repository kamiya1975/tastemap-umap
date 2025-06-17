import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapPage from './MapPage';
import ProductDetail from './ProductDetail';
import StoreSelectPage from './StoreSelectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/select-store" element={<StoreSelectPage />} />
        <Route path="/products/:jan" element={<ProductDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
