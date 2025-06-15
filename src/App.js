// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapPage from './MapPage';
import ProductDetail from './ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* 商品詳細ページ：/products/:jan */}
        <Route path="/products/:jan" element={<ProductDetail />} />

        {/* 一覧・散布図ページ（トップ）：/ */}
        <Route path="/" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
