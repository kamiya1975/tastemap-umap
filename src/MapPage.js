// src/MapPage.js
import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

function MapPage() {
  const [data, setData] = useState([]);
  const [slider_pc1, setSliderPc1] = useState(50);
  const [slider_pc2, setSliderPc2] = useState(50);
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    const handleResize = () => window.dispatchEvent(new Event('resize'));
    setTimeout(handleResize, 300);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          const entry = {};
          headers.forEach((h, i) => {
            entry[h] = isNaN(values[i]) ? values[i] : parseFloat(values[i]);
          });
          return entry;
        });
      };

      const pcaData = parseCSV(pcaText);
      const metaData = parseCSV(metaText);
      const metaMap = Object.fromEntries(metaData.map(d => [String(d.JAN), d]));
      const merged = pcaData.map(d => ({ ...d, ...metaMap[String(d.JAN)] }));
      setData(merged);
    });
  }, []);

  const distances = useMemo(() => {
    return data
      .map((d) => {
        const dx = slider_pc1 - d.BodyAxis;
        const dy = slider_pc2 - d.SweetAxis;
        return {
          ...d,
          distance: Math.sqrt(dx * dx + dy * dy),
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
  }, [data, slider_pc1, slider_pc2]);

  const handleRatingChange = (jan, rating) => {
    setUserRatings((prev) => ({ ...prev, [jan]: rating }));
  };

  const top10List = useMemo(() => (
    distances.map((item, index) => (
      <div key={item.JAN} className="top10-item">
        <strong>{`${index + 1}. ${item['商品名']} (${item.Type || ''})`}</strong>
        <div>{item['生産者名'] || ''}（{item['生産国'] || ''}）</div>
        <div>価格: {item['希望小売価格'] ? `¥${parseInt(item['希望小売価格']).toLocaleString()}` : '不明'}</div>
        <select
          value={userRatings[item.JAN] || ''}
          onChange={(e) => handleRatingChange(item.JAN, parseInt(e.target.value))}
        >
          <option value="">未評価</option>
          {[1, 2, 3, 4, 5].map((v) => (
            <option key={v} value={v}>{'⭐️'.repeat(v)}</option>
          ))}
        </select>
      </div>
    ))
  ), [distances, userRatings]);

  const plotData = [
    {
      x: data.map((d) => d.BodyAxis),
      y: data.map((d) => d.SweetAxis),
      text: data.map((d) => d['商品名']),
      mode: 'markers',
      type: 'scatter',
      marker: { size: 8, color: 'gray' },
      name: '全ワイン',
    },
    {
      x: [slider_pc1],
      y: [slider_pc2],
      text: ['あなたの好み'],
      mode: 'markers+text',
      type: 'scatter',
      marker: {
        size: 16,
        color: 'red',
        line: { color: 'black', width: 2 },
      },
      textposition: 'top center',
      name: '好み位置',
    },
    ...Object.entries(userRatings)
      .filter(([jan, rating]) => rating > 0)
      .map(([jan, rating]) => {
        const wine = data.find((d) => d.JAN === jan);
        if (!wine) return null;
        return {
          x: [wine.BodyAxis],
          y: [wine.SweetAxis],
          text: [`${wine['商品名']} ⭐️${rating}`],
          mode: 'markers+text',
          type: 'scatter',
          marker: {
            size: rating * 8 + 10,
            color: 'orange',
            opacity: 0.8,
            line: { color: 'green', width: 1.5 },
          },
          textposition: 'bottom center',
          name: '評価ワイン',
        };
      })
      .filter(Boolean),
  ];

  return (
    <div>
      <h2>基準のワインを飲んだ印象は？</h2>

      <div className="slider-label">ボディ感（軽い 〜 重い）</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setSliderPc1(Math.max(slider_pc1 - 1, 0))}>−</button>
        <input
          type="range"
          min="0"
          max="100"
          value={slider_pc1}
          onChange={(e) => setSliderPc1(Number(e.target.value))}
        />
        <button onClick={() => setSliderPc1(Math.min(slider_pc1 + 1, 100))}>＋</button>
      </div>

      <div className="slider-label">甘さ（辛口 〜 甘口）</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setSliderPc2(Math.max(slider_pc2 - 1, 0))}>−</button>
        <input
          type="range"
          min="0"
          max="100"
          value={slider_pc2}
          onChange={(e) => setSliderPc2(Number(e.target.value))}
        />
        <button onClick={() => setSliderPc2(Math.min(slider_pc2 + 1, 100))}>＋</button>
      </div>

      <div className="plot-container">
        <Plot
          data={plotData}
          layout={{
            width: undefined,
            height: 400,
            title: '味わいマップ',
            xaxis: { title: 'ボディ感' },
            yaxis: { title: '甘さ' },
            margin: { t: 40, b: 40, l: 40, r: 40 },
            dragmode: 'pan',
          }}
          config={{ responsive: true }}
        />
      </div>

      <div className="recommendation-list">
        <h2>あなたの好みに寄り添うワイン</h2>
        {top10List}
      </div>
    </div>
  );
}

export default MapPage;
