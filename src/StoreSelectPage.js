import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function StoreSelectPage() {
  const navigate = useNavigate();

  const dummyStores = [
    { name: 'スーパーマーケットA ◯◯◯店', distance: '1.5km' },
    { name: 'スーパーマーケットB ◯◯◯店', distance: '1.6km' },
    { name: 'スーパーマーケットC ◯◯◯店', distance: '2.5km' },
    { name: 'スーパーマーケットD ◯◯◯店', distance: '3.5km' },
    { name: 'スーパーマーケットE ◯◯◯店', distance: '3.6km' },
    { name: 'スーパーマーケットF ◯◯◯店', distance: '5.5km' },
  ];

  const handleSelect = (store) => {
    console.log('選択した店舗:', store.name);
    navigate('/map');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>購入した店舗を選んでください</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th style={{ textAlign: 'left' }}>店舗一覧</th>
            <th style={{ textAlign: 'right' }}>距離</th>
          </tr>
        </thead>
        <tbody>
          {dummyStores.map((store, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px' }}>➡</td>
              <td>
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
                  }}
                >
                  {store.name}
                </button>
              </td>
              <td style={{ textAlign: 'right' }}>{store.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StoreSelectPage;
