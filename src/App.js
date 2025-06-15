// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapPage from './MapPage';
import ProductDetail from './ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* 商品詳細ページ */}
        <Route path="/products/:jan" element={<ProductDetail />} />

        {/* トップページ（スライダー＋散布図） */}
        <Route path="/" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
