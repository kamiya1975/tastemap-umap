import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapPage from './MapPage';
import ProductDetail from './ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/products/:jan" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
