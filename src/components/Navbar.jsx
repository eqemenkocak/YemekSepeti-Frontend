import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logoImg from '../assets/logo.png'; 

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    window.location.href = '/login'; 
  };

  const displayName = user ? (user.fullName || user.email) : "Misafir";
  const displayInitial = displayName ? displayName[0].toUpperCase() : "M";

  return (
    <nav style={{ 
      backgroundColor: '#ff0000', 
      padding: '0 40px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '100px', 
      transition: 'height 0.3s'
    }}>
      
      {/* LOGO KISMI */}
      <div 
        onClick={() => navigate('/')} 
        style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center',
            height: '100%', 
        }}
      >
        <img 
            src={logoImg} 
            alt="TıklaYe Logo" 
            style={{ 
                height: '160px', 
                marginTop: '-10px', 
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                position: 'relative', 
                zIndex: 1001 
            }} 
        />
      </div>

      {/* SAĞ TARAF: MENÜLER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        <button 
          onClick={() => navigate('/cart')}
          style={{ 
            background: 'white', color: '#ff0000', border: 'none', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🛒 Sepet 
          <span style={{ background: '#ff0000', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '14px', marginLeft: '2px' }}>{cart.length}</span>
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            <div 
                onClick={() => navigate('/profile')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '1.1em' }}
                title="Profilimi Düzenle"
            >
              <div style={{ width: '40px', height: '40px', background: 'white', color: '#ff4d4d', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '20px', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                {displayInitial}
              </div>
              <span>{displayName}</span>
            </div>

            {user.role !== 'RestaurantOwner' && (
               <button onClick={() => navigate('/my-orders')} style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                 📦 Siparişlerim
               </button>
            )}

            {user.role === 'RestaurantOwner' && (
                <button 
                    onClick={() => navigate('/admin')} 
                    style={{ 
                        background: 'white',       
                        color: '#ff0000',          
                        border: '2px solid white', 
                        padding: '8px 15px', 
                        borderRadius: '20px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
                    }}
                >
                    ⚙️ Yönetim
                </button>
            )}

            <button onClick={handleLogout} style={{ background: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight:'bold' }}>Çıkış</button>
          </div>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', border: '2px solid white', padding: '10px 25px', borderRadius: '30px', fontSize: '16px', transition: '0.3s' }}>
            🔑 Giriş Yap
          </Link>
        )}

      </div>
    </nav>
  );
}