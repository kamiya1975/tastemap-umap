// src/ProductDetail.js
import React, { useEffect, useState } from 'react';

function ProductDetail() {
  const jan = window.location.pathname.split('/').pop();
  const [data, setData] = useState([]);
  const [targetWine, setTargetWine] = useState(null);
  const [similarWines, setSimilarWines] = useState([]);
  const [rating, setRating] = useState(() => {
    const stored = localStorage.getItem('userRatings');
    return stored ? JSON.parse(stored)[jan] || 0 : 0;
  });

  const handleCloseTab = () => {
    window.close();
  };

  useEffect(() => {
    fetch('/pca_result.csv')
      .then(res => res.text())
      .then(text => {
        const rows = text.trim().split('\n');
        const headers = rows[0].split(',');
        const parsed = rows.slice(1).map(row => {
          const values = row.split(',');
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = isNaN(values[i]) ? values[i] : parseFloat(values[i]);
          });
          return obj;
        });
        setData(parsed);

        const target = parsed.find(d => String(d.JAN).trim() === String(jan).trim());
        setTargetWine(target);

        if (target) {
          const distances = parsed
            .filter(d => String(d.JAN).trim() !== String(jan).trim())
            .map(d => {
              const dx = d.BodyAxis - target.BodyAxis;
              const dy = d.SweetAxis - target.SweetAxis;
              return { ...d, distance: Math.sqrt(dx * dx + dy * dy) };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

          setSimilarWines(distances);
        }
      });
  }, [jan]);

  const handleRatingChange = (e) => {
    const newRating = parseInt(e.target.value);
    setRating(newRating);
    const stored = localStorage.getItem('userRatings');
    const ratings = stored ? JSON.parse(stored) : {};
    ratings[jan] = newRating;
    localStorage.setItem('userRatings', JSON.stringify(ratings));
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleCloseTab} style={{ marginBottom: '20px' }}>
        ← 一覧に戻る（タブを閉じる）
      </button>
      <h2>商品詳細ページ</h2>
      <p>JANコード：{jan}</p>
      <p>ここに商品名・味の特徴・香り・価格・画像などを表示していきます。</p>

      <div style={{ marginTop: '20px' }}>
        <label><strong>星評価：</strong></label>
        <select value={rating} onChange={handleRatingChange} style={{ marginLeft: '10px' }}>
          {["未評価", "★", "★★", "★★★", "★★★★", "★★★★★"].map((label, idx) => (
            <option key={idx} value={idx}>{label}</option>
          ))}
        </select>
      </div>

      {similarWines.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>この商品に近い味わいのワイン</h3>
          <ul>
            {similarWines.map((wine, index) => (
              <li key={wine.JAN} style={{ marginBottom: '10px' }}>
                {index + 1}. {wine.商品名} ({wine.Type}) – 距離: {wine.distance.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;

