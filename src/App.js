// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapPage from './MapPage';
import ProductDetail from './ProductDetail';
import StoreSelectPage from './StoreSelectPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 店舗選択ページ（QRコード読み取り後の遷移先） */}
        <Route path="/select-store" element={<StoreSelectPage />} />

        {/* 商品詳細ページ（JAN指定） */}
        <Route path="/products/:jan" element={<ProductDetail />} />

        {/* トップページ（スライダー＋散布図） */}
        <Route path="/" element={<MapPage />} />

        {/* /map に直接アクセスできるようにしておきたい場合 */}
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
