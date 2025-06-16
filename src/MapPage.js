import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import './App.css';
import { Link } from 'react-router-dom';

function MapPage() {
  const [data, setData] = useState([]);
  const [slider_pc1, setSliderPc1] = useState(50);
  const [slider_pc2, setSliderPc2] = useState(50);
  const [initial_pc1, setInitialPc1] = useState(50);
  const [initial_pc2, setInitialPc2] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(() => parseFloat(localStorage.getItem('zoomLevel')) || 2.0);
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    const storedRatings = localStorage.getItem('userRatings');
    if (storedRatings) setUserRatings(JSON.parse(storedRatings));
  }, []);

  useEffect(() => {
    localStorage.setItem('slider_pc1', slider_pc1);
    localStorage.setItem('slider_pc2', slider_pc2);
  }, [slider_pc1, slider_pc2]);

  useEffect(() => {
    localStorage.setItem('zoomLevel', zoomLevel);
  }, [zoomLevel]);

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
      const merged = pcaData.map(d => ({
        ...d,
        希望小売価格: metaMap[String(d.JAN)]?.希望小売価格 || null,
        ...metaMap[String(d.JAN)]
      }));

      const blendF = merged.find(d => d.JAN === 'blendF');
      const xValues = merged.map(d => d.BodyAxis);
      const yValues = merged.map(d => d.SweetAxis);
      const x_min = Math.min(...xValues);
      const x_max = Math.max(...xValues);
      const y_min = Math.min(...yValues);
      const y_max = Math.max(...yValues);

      if (blendF) {
        const pc1 = ((blendF.BodyAxis - x_min) / (x_max - x_min)) * 100;
        const pc2 = ((blendF.SweetAxis - y_min) / (y_max - y_min)) * 100;
        setInitialPc1(pc1);
        setInitialPc2(pc2);
        setSliderPc1(pc1);
        setSliderPc2(pc2);
      }

      setData(merged);
    });
  }, []);

  const xValues = data.map(d => d.BodyAxis);
  const yValues = data.map(d => d.SweetAxis);
  const x_min = Math.min(...xValues);
  const x_max = Math.max(...xValues);
  const y_min = Math.min(...yValues);
  const y_max = Math.max(...yValues);

  const target = useMemo(() => ({
    x: x_min + (slider_pc1 / 100) * (x_max - x_min),
    y: y_min + (slider_pc2 / 100) * (y_max - y_min)
  }), [slider_pc1, slider_pc2, x_min, x_max, y_min, y_max]);

  const distances = useMemo(() => {
    return data.filter(d => d.JAN !== 'blendF')
      .map(d => {
        const dx = d.BodyAxis - target.x;
        const dy = d.SweetAxis - target.y;
        return { ...d, distance: Math.sqrt(dx * dx + dy * dy) };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
  }, [data, target]);

  const zoomFactor = 1 / zoomLevel;
  const blendF = data.find((d) => d.JAN === 'blendF');
  const x_range = blendF ? [blendF.BodyAxis - (x_max - x_min) * zoomFactor / 2, blendF.BodyAxis + (x_max - x_min) * zoomFactor / 2] : [x_min, x_max];
  const y_range = blendF ? [blendF.SweetAxis - (y_max - y_min) * zoomFactor / 2, blendF.SweetAxis + (y_max - y_min) * zoomFactor / 2] : [y_min, y_max];

  return (
    <div style={{ padding: '10px' }}>
      <h2>基準のワインを飲んだ印象は？</h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px' }}>
          <span>← こんなに甘みは不要</span>
          <span>もっと甘みが欲しい →</span>
        </div>
        <input
          type="range"
          min={-50}
          max={50}
          value={slider_pc2 - initial_pc2}
          style={{ width: '100%' }}
          onChange={(e) => setSliderPc2(initial_pc2 + Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px' }}>
          <span>← もっと軽やかが良い</span>
          <span>濃厚なコクが欲しい →</span>
        </div>
        <input
          type="range"
          min={-50}
          max={50}
          value={slider_pc1 - initial_pc1}
          style={{ width: '100%' }}
          onChange={(e) => setSliderPc1(initial_pc1 + Number(e.target.value))}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        <button onClick={() => setZoomLevel(z => Math.min(z + 1.0, 5))}>+</button>
        <button onClick={() => setZoomLevel(z => Math.max(z - 1.0, 0.2))}>-</button>
      </div>

      <div className="plot-container">
        <Plot
          useResizeHandler={true}
          style={{ width: 'calc(100vw - 20px)', height: '100%' }}
          data={[
            {
              x: data.map(d => d.BodyAxis),
              y: data.map(d => d.SweetAxis),
              mode: 'markers',
              type: 'scatter',
              text: data.map(d => d.商品名),
              marker: { size: 5, color: 'gray' },
              name: '全ワイン'
            },
            {
              x: [target.x],
              y: [target.y],
              mode: 'markers',
              type: 'scatter',
              marker: { size: 20, color: 'green', symbol: 'x' },
              name: 'あなたの好み',
              hoverinfo: 'skip'
            },
            {
              x: distances.map(d => d.BodyAxis),
              y: distances.map(d => d.SweetAxis),
              text: distances.map((d, i) => '❶❷❸❹❺❻❼❽❾❿'[i] || `${i + 1}`),
              mode: 'markers+text',
              type: 'scatter',
              marker: { size: 10, color: 'white' },
              textfont: { color: 'black', size: 12 },
              textposition: 'middle center',
              name: 'TOP10',
              showlegend: false,
              hoverinfo: 'text'
            },
          ]}
          layout={{
            margin: { l: 30, r: 30, t: 30, b: 30 },
            dragmode: 'pan',
            xaxis: {
              range: x_range,
              showticklabels: false,
              showgrid: true,
              gridcolor: 'lightgray',
              gridwidth: 1,
              zeroline: false,
              showline: true,
              mirror: true,
              linecolor: 'black',
              linewidth: 2,
              scaleanchor: 'y'
            },
            yaxis: {
              range: y_range,
              showticklabels: false,
              showgrid: true,
              gridcolor: 'lightgray',
              gridwidth: 1,
              zeroline: false,
              showline: true,
              mirror: true,
              linecolor: 'black',
              linewidth: 2,
              scaleratio: 1
            },
            legend: { orientation: 'h', x: 0.5, y: -0.25, xanchor: 'center', yanchor: 'top' }
          }}
          config={{ responsive: true, scrollZoom: true, displayModeBar: false }}
        />
      </div>
    </div>
  );
}

export default MapPage;
