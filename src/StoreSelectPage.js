import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // スタイリングはお好みで調整

function StoreSelectPage() {
  const navigate = useNavigate();

  const dummyStores = [
    { name: 'スーパーマーケットA ◯◯◯店', distance: '1.5km' },
    { name: 'スーパーマーケットB ◯◯◯店', distance: '1.6km' },
    { name: 'スーパーマーケットA ◯◯◯店', distance: '2.5km' },
    { name: 'スーパーマーケットC ◯◯◯店', distance: '3.5km' },
    { name: 'スーパーマーケットD ◯◯◯店', distance: '3.6km' },
    { name: 'スーパーマーケットA ◯◯◯店', distance: '5.5km' },
  ];

  const handleSelect = (store) => {
    // 本来はここで選択店舗を保存する処理などが必要
    // 現状はどの店舗を選んでもマップページへ遷移
    navigate('/map');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>購入した店舗を選んでください</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th style={{ padding: '10px' }}>📍</th>
            <th style={{ textAlign: 'left' }}>店舗一覧</th>
            <th style={{ textAlign: 'right' }}>距離</th>
          </tr>
        </thead>
        <tbody>
          {dummyStores.map((store, index) => (
            <tr
              key={index}
              style={{ borderBottom: '1px solid #ccc', cursor: 'pointer' }}
              onClick={() => handleSelect(store)}
            >
              <td style={{ padding: '10px' }}>➡</td>
              <td>{store.name}</td>
              <td style={{ textAlign: 'right' }}>{store.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StoreSelectPage;
