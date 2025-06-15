import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { jan } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    // 一覧に戻るときに、戻る対象のJANコードを state に渡す
    navigate('/', { state: { fromJan: jan } });
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleBack} style={{ marginBottom: '20px', fontSize: '16px' }}>
        ← 一覧に戻る
      </button>
      <h2>商品詳細ページ</h2>
      <p><strong>JANコード：</strong>{jan}</p>
      <p>ここに商品名・味の特徴・香り・価格・画像などを表示していきます。</p>
    </div>
  );
}

export default ProductDetail;