import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  // Giriş yapan kullanıcıyı hafızadan oku
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    window.location.href = '/login'; 
  };

  const displayName = user ? (user.fullName || user.email) : "Misafir";
  const displayInitial = displayName ? displayName[0].toUpperCase() : "M";

  return (
    <nav style={{ 
      backgroundColor: '#ff4d4d', 
      padding: '15px 40px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* SOL TARAF: LOGO */}
      <div 
        onClick={() => navigate('/')} 
        style={{ fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        🍕 YEMEK SEPETİM
      </div>

      {/* SAĞ TARAF: SEPET VE KULLANICI */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Sepet Butonu */}
        <button 
          onClick={() => navigate('/cart')}
          style={{ 
            background: 'white', color: '#ff4d4d', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🛒 Sepet 
          <span style={{ background: '#ff4d4d', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '12px', marginLeft: '5px' }}>{cart.length}</span>
        </button>

        {/* KULLANICI BİLGİSİ */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            {/* İsim ve Logo (Tıklayınca Profile gider) */}
            <div 
                onClick={() => navigate('/profile')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', cursor: 'pointer' }}
                title="Profilimi Düzenle"
            >
              <div style={{ width: '35px', height: '35px', background: 'white', color: '#ff4d4d', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px', border: '2px solid white' }}>
                {displayInitial}
              </div>
              <span>{displayName}</span>
            </div>

            {/* 👇 GÜNCELLENEN KISIM: Restoran Sahibi DEĞİLSE Siparişlerimi Göster */}
            {user.role !== 'RestaurantOwner' && (
               <button 
                  onClick={() => navigate('/my-orders')}
                  style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
               >
                 📦 Siparişlerim
               </button>
            )}

            {/* Restoran Sahibi ise Yönetim Paneli */}
            {user.role === 'RestaurantOwner' && (
               <button onClick={() => navigate('/admin')} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>⚙️ Yönetim</button>
            )}

            <button onClick={handleLogout} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>Çıkış</button>
          </div>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', border: '1px solid white', padding: '8px 15px', borderRadius: '5px' }}>🔑 Giriş Yap</Link>
        )}

      </div>
    </nav>
  );
}