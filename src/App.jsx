import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import OrderHistory from './components/OrderHistory';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
import FavoritesSidebar from './components/FavoritesSidebar';
import { CartProvider } from './context/CartContext'; 
import { FavoritesProvider, useFavorites } from './context/FavoritesContext'; 

// 👇 YENİ: SAĞDA SABİT DURAN FAVORI BUTONU BİLEŞENİ
const FloatingFavoriteButton = () => {
  const { toggleSidebar, favorites } = useFavorites();

  // Eğer favori yoksa butonu gösterme (İstersen bu satırı silip hep gösterebilirsin)
  if (favorites.length === 0) return null;

  return (
    <button 
      onClick={toggleSidebar}
      style={{
        position: 'fixed',
        top: '50%',
        right: '0',
        transform: 'translateY(-50%)', // Tam ortala
        backgroundColor: '#fff',
        color: '#ff4d4d',
        border: '1px solid #ff4d4d',
        borderRight: 'none', // Sağa yapışık hissi ver
        padding: '10px 15px',
        borderRadius: '10px 0 0 10px', // Sol köşeleri yuvarla
        cursor: 'pointer',
        boxShadow: '-2px 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        fontWeight: 'bold',
        fontSize: '12px'
      }}
    >
      <span style={{ fontSize: '24px' }}>💖</span>
      <span>{favorites.length} Ürün</span>
    </button>
  );
};

function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <BrowserRouter>
          
          <Navbar />
          <FavoritesSidebar />
          
          {/* 👇 SAĞDAKİ BUTONU BURAYA KOYDUK */}
          <FloatingFavoriteButton />

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