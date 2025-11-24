import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import OrderHistory from './components/OrderHistory';
import ProfilePage from './components/ProfilePage'; // 👈 Bunu ekledim
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext'; 

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        
        {/* ✅ DÜZELTME: Navbar dışarıda, tam ekran yayılacak */}
        <Navbar />

        {/* İçerik kısmı ortalı */}
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
          <Routes>
            <Route path="/" element={<RestaurantList />} />
            <Route path="/menu/:id" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/my-orders" element={<OrderHistory />} />
            
            {/* 👇 Profil rotasını da ekledim ki link çalışsın */}
            <Route path="/profile" element={<ProfilePage />} /> 
          </Routes>
        </div>

      </BrowserRouter>
    </CartProvider>
  );
}

export default App;