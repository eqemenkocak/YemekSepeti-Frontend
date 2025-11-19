import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import ProductList from './components/ProductList';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        {/* Üst Menü Çubuğu */}
        <nav style={{ backgroundColor: '#ff4d4d', padding: '15px', color: 'white', marginBottom: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>🍕 YEMEK SEPETİM</h1>
        </nav>
        
        <Routes>
          {/* 1. Yol: Anasayfa açılınca Restoran Listesi gelsin */}
          <Route path="/" element={<RestaurantList />} />
          
          {/* 2. Yol: Linkin sonunda ID varsa o restoranın menüsü gelsin */}
          <Route path="/menu/:id" element={<ProductList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;