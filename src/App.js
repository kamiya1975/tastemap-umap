import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapPage from './MapPage';
import ProductDetail from './ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* この順番が重要！ */}
        <Route path="/products/:jan" element={<ProductDetail />} />
        <Route path="/" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
