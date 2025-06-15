// src/ProductDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { jan } = useParams();
  const navigate = useNavigate();

  // TOP10の順位（❶〜❿）とJANコードの対応を仮定的に定義（本来はpropsやcontextなどで受け取るべき）
  const rankMap = {
    "JANコード1": "❶",
    "JANコード2": "❷",
    "JANコード3": "❸",
    "JANコード4": "❹",
    "JANコード5": "❺",
    "JANコード6": "❻",
    "JANコード7": "❼",
    "JANコード8": "❽",
    "JANコード9": "❾",
    "JANコード10": "❿",
  };

  const handleBack = () => {
    const rankSymbol = rankMap[jan]; // 例えば "❸"
    if (rankSymbol) {
      navigate('/', { state: { from: rankSymbol } });
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleBack} style={{ marginBottom: '20px' }}>
        ← 一覧に戻る
      </button>
      <h2>商品詳細ページ</h2>
      <p>JANコード：{jan}</p>
      <p>ここに商品名・味の特徴・香り・価格・画像などを表示していきます。</p>
    </div>
  );
}

export default ProductDetail;
