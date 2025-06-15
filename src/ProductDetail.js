// src/ProductDetail.js
import React from 'react';

function ProductDetail() {
  const jan = window.location.pathname.split('/').pop();

  const handleCloseTab = () => {
    // 一部ブラウザでは、window.close() が機能しない場合もあるので対策文言付き
    if (window.confirm("このタブを閉じて一覧に戻りますか？")) {
      window.close();
    }
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