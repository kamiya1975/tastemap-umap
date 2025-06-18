import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function StoreSelectPage() {
  const navigate = useNavigate();

  const dummyStores = [
    { name: 'スーパーマーケットA店', distance: '1.5km' },
    { name: 'スーパーマーケットB店', distance: '1.6km' },
    { name: 'スーパーマーケットC店', distance: '2.5km' },
    { name: 'スーパーマーケットD店', distance: '3.5km' },
    { name: 'スーパーマーケットE店', distance: '3.6km' },
    { name: 'スーパーマーケットF店', distance: '5.5km' },
  ];

  const handleSelect = (store) => {
    console.log('選択した店舗:', store.name);
    navigate('/map');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>「基準のワイン」を購入した店舗を選んでください</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th style={{ textAlign: 'left', width: '70%' }}>店舗一覧</th>
            <th style={{ textAlign: 'right', width: '30%' }}>距離</th>
          </tr>
        </thead>
        <tbody>
          {dummyStores.map((store, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
              <td colSpan="2" style={{ padding: '10px 0' }}>
                <button
                  onClick={() => handleSelect(store)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    textAlign: 'left',
                    width: '100%',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>➡ {store.name}</span>
                  <span>{store.distance}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StoreSelectPage;
