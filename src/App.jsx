import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import OrderHistory from './components/OrderHistory';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
// 👇 YENİ EKLENEN IMPORTLAR (Favoriler İçin)
import FavoritesSidebar from './components/FavoritesSidebar';
import { CartProvider } from './context/CartContext'; 
import { FavoritesProvider } from './context/FavoritesContext'; 

function App() {
  return (
    <CartProvider>
      {/* 👇 1. UYGULAMAYI FAVORİ HAFIZASIYLA SARMALIYORUZ */}
      <FavoritesProvider>
        <BrowserRouter>
          
          <Navbar />
          
          {/* 👇 2. SAĞDAN AÇILAN FAVORİ PANELİNİ EKLEDİK */}
          <FavoritesSidebar />

          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
            <Routes>
              <Route path="/" element={<RestaurantList />} />
              <Route path="/menu/:id" element={<ProductList />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/my-orders" element={<OrderHistory />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>

        </BrowserRouter>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;