import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { jan } = useParams();
  const [data, setData] = useState([]);
  const [targetWine, setTargetWine] = useState(null);
  const [similarWines, setSimilarWines] = useState([]);
  const [rating, setRating] = useState(() => {
    const stored = localStorage.getItem('userRatings');
    return stored ? JSON.parse(stored)[jan] || 0 : 0;
  });

  const [sliderPc1, setSliderPc1] = useState(50);
  const [sliderPc2, setSliderPc2] = useState(50);

  const handleCloseTab = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/pca_result.csv').then(res => res.text()),
      fetch('/Merged_TasteDataDB15.csv').then(res => res.text())
    ]).then(([pcaText, metaText]) => {
      const parseCSV = (csvText) => {
        const rows = csvText.trim().split('\n');
        const headers = rows[0].split(',');
        return rows.slice(1).map(row => {
          const values = row.split(',');
          const obj = {};
          headers.forEach((h, i) => {
            obj[h.trim()] = isNaN(values[i]) ? values[i].trim() : parseFloat(values[i]);
          });
          return obj;
        });
      };

      const pcaData = parseCSV(pcaText);
      const metaData = parseCSV(metaText);
      const metaMap = Object.fromEntries(metaData.map(d => [String(d.JAN), d]));

      const merged = pcaData.map(d => ({
        ...d,
        ...metaMap[d.JAN]  // 希望小売価格やTypeなどを補完
      }));

      setData(merged);
      const target = merged.find(d => String(d.JAN).trim() === String(jan).trim());
      setTargetWine(target);

      if (target) {
        const xValues = merged.map(d => d.BodyAxis);
        const yValues = merged.map(d => d.SweetAxis);
        const x_min = Math.min(...xValues);
        const x_max = Math.max(...xValues);
        const y_min = Math.min(...yValues);
        const y_max = Math.max(...yValues);

        setSliderPc1(((target.BodyAxis - x_min) / (x_max - x_min)) * 100);
        setSliderPc2(((target.SweetAxis - y_min) / (y_max - y_min)) * 100);
      }
    });
  }, [jan]);

  useEffect(() => {
    if (!data.length || !targetWine) return;

    const xValues = data.map(d => d.BodyAxis);
    const yValues = data.map(d => d.SweetAxis);
    const x_min = Math.min(...xValues);
    const x_max = Math.max(...xValues);
    const y_min = Math.min(...yValues);
    const y_max = Math.max(...yValues);

    const x = x_min + (sliderPc1 / 100) * (x_max - x_min);
    const y = y_min + (sliderPc2 / 100) * (y_max - y_min);

    const distances = data
      .filter(d => String(d.JAN).trim() !== String(jan).trim())
      .map(d => {
        const dx = d.BodyAxis - x;
        const dy = d.SweetAxis - y;
        return { ...d, distance: Math.sqrt(dx * dx + dy * dy) };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    setSimilarWines(distances);
  }, [sliderPc1, sliderPc2, data, jan, targetWine]);

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

      <h2>{targetWine?.商品名 || '商品名を取得中...'}</h2>
      <p><strong>JANコード：</strong>{jan}</p>
      <p>ここに商品名・味の特徴・香り・価格・画像などを表示していきます。</p>

      <div style={{ marginTop: '20px' }}>
        <label><strong>星評価：</strong></label>
        <select value={rating} onChange={handleRatingChange} style={{ marginLeft: '10px' }}>
          {["未評価", "★", "★★", "★★★", "★★★★", "★★★★★"].map((label, idx) => (
            <option key={idx} value={idx}>{label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>この味に近いワインを再検索</h3>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>← 軽やか</span>
            <span>コクあり →</span>
          </div>
          <input type="range" min="0" max="100" value={sliderPc1} onChange={e => setSliderPc1(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>← 甘さ控えめ</span>
            <span>甘め →</span>
          </div>
          <input type="range" min="0" max="100" value={sliderPc2} onChange={e => setSliderPc2(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      {similarWines.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>この味に近いワイン</h3>
          <ul>
            {similarWines.map((wine, index) => {
              const priceText =
                wine.希望小売価格 !== null && wine.希望小売価格 !== undefined
                  ? `${parseInt(wine.希望小売価格).toLocaleString()} 円`
                  : '価格未設定';

              return (
                <li key={wine.JAN} style={{ marginBottom: '10px' }}>
                  {index + 1}. {wine.商品名}（{wine.Type}） - {priceText}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
