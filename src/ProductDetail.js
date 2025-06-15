// src/ProductDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { jan } = useParams();

  // 後でCSVやAPIから商品データを取得する仕組みにする
  return (
    <div style={{ padding: '20px' }}>
      <h2>商品詳細ページ</h2>
      <p>JANコード：{jan}</p>
      <p>ここに商品名・味の特徴・香り・価格・画像などを表示していきます。</p>
    </div>
  );
}

export default ProductDetail;
