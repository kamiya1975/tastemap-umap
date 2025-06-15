// src/ProductDetail.js
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ProductDetail() {
  const { jan } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // URLクエリパラメータから順位を取得（例：?rank=3）
  const searchParams = new URLSearchParams(location.search);
  const rank = searchParams.get('rank');

  const handleBack = () => {
    if (rank) {
      navigate(`/map#rank-${rank}`);
    } else {
      navigate('/map');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // 詳細ページはページトップから表示
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleBack} style={{ marginBottom: '20px' }}>← 一覧に戻る</button>
      <h2>商品詳細ページ</h2>
      <p>JANコード：{jan}</p>
      <p>ここに商品名・味の特徴・香り・価格・画像などを表示していきます。</p>
    </div>
  );
}

export default ProductDetail;

