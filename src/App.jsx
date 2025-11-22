import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // useNavigate ekledik
import RestaurantList from './components/RestaurantList';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import { CartProvider, useCart } from './context/CartContext'; 

// Navbar'ı ayrı bir bileşen olarak tanımlıyoruz ki içindeki kancaları (hooks) kullanabilelim
function Navbar() {
  const { cart } = useCart(); 
  const navigate = useNavigate(); // Sayfa değiştirmek için
  
  // Giriş yapmış kullanıcı var mı?
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    // 1. Hafızayı sil
    localStorage.removeItem('user');
    // 2. Sayfayı yenile (En temizi budur, sepeti vs sıfırlar)
    window.location.href = '/';
  };
  
  return (
    <nav style={{ 
      backgroundColor: '#ff4d4d', 
      padding: '15px 20px', 
      color: 'white', 
      marginBottom: '20px', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '0 0 10px 10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {/* LOGO */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
        🍕 YEMEK SEPETİM
      </Link>
      
      {/* SAĞ TARAF (Menü Linkleri) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* SEPET (Her zaman görünür) */}
        <Link to="/cart" style={{ textDecoration: 'none', color: 'white' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', border: '1px solid white', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}>
                🛒 Sepet 
                <span style={{ background: 'white', color: '#ff4d4d', padding: '2px 8px', borderRadius: '50%', fontSize: '14px' }}>{cart.length}</span>
            </div>
        </Link>

        {/* KULLANICI DURUMUNA GÖRE DEĞİŞEN KISIM */}
        {user ? (
            // EĞER GİRİŞ YAPMIŞSA BUNLARI GÖSTER
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: 'bold' }}>👤 {user.name}</span>
                
                {/* Eğer Patron ise Admin Paneli Linki Çıksın */}
                {user.role === 'RestaurantOwner' && (
                    <Link to="/admin" style={{ color: 'white', textDecoration: 'underline', fontSize: '14px' }}>Yönetim Paneli</Link>
                )}

                <button 
                    onClick={handleLogout}
                    style={{ background: '#333', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
                >
                    Çıkış Yap
                </button>
            </div>
        ) : (
            // GİRİŞ YAPMAMIŞSA BUNU GÖSTER
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'white', color: '#ff4d4d', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🔑 Giriş Yap
                </button>
            </Link>
        )}

      </div>
    </nav>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<RestaurantList />} />
            <Route path="/menu/:id" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;