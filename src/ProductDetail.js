// src/ProductDetail.js
import React from 'react';

function ProductDetail() {
  const jan = window.location.pathname.split('/').pop();

  const handleCloseTab = () => {
    window.close(); // ⭐️ タブを閉じるだけ（確認ダイアログなし）
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleCloseTab} style={{ marginBottom: '20px' }}>
        ← 一覧に戻る（タブを閉じる）
      </button>
      <h2>商品詳細ページ</h2>
      <p>JANコード：{jan}</p>
      <p>ここに商品名・味の特徴・香り・価格・画像などを表示していきます。</p>
    </div>
  );
}

export default ProductDetail;
