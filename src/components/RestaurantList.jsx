import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/sitelogo.png';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 1. ARAMA STATE'İ
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const displayName = user ? (user.fullName || user.email) : "Misafir";

  useEffect(() => {
    axios.get('https://localhost:7197/api/Restaurants')
      .then(response => setRestaurants(response.data))
      .catch(error => console.error(error));
  }, []);

  // 👇 2. FİLTRELEME MANTIĞI
  // Eğer arama kutusu boşsa hepsini göster, doluysa isme göre filtrele
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* KIRMIZI BANNER */}
      <div style={{ 
        backgroundColor: '#ff0000', 
        color: 'white',
        padding: '50px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <img 
            src={logoImg} 
            alt="TıklaYe Logo" 
            style={{ height: '130px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} 
        />
        <div style={{ textAlign: 'left' }}>
            <h1 style={{ margin: 0, fontSize: '4em', fontWeight: '800', fontFamily: "'Poppins', sans-serif", letterSpacing: '2px', lineHeight: '1', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>TIKLA YE</h1>
            <p style={{ margin: '10px 0 0 5px', fontSize: '1.8em', fontWeight: '400', opacity: 0.95, fontFamily: "'Poppins', sans-serif" }}>Lezzet Kapında</p>
        </div>
      </div>

      {/* HOŞGELDİN MESAJI */}
      {user && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ fontSize: '1.5em' }}>👋</span> 
             <h2 style={{ margin: 0, color: '#2D3436' }}>Hoşgeldin, <span style={{ color: '#ff0000' }}>{displayName}</span></h2>
        </div>
      )}

      {/* 👇 3. ARAMA ÇUBUĞU (YENİ) */}
      <div style={{ maxWidth: '600px', margin: '0 auto 40px auto', padding: '0 20px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '15px', fontSize: '20px' }}>🔍</span>
            <input 
                type="text" 
                placeholder="Hangi restoranı arıyorsun? (Örn: Burger, Pide...)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '15px 15px 15px 45px', // Soldan boşluk bıraktık ki ikon sığsın
                    borderRadius: '30px',
                    border: '2px solid #eee',
                    fontSize: '16px',
                    outline: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    transition: 'border 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff0000'} // Tıklayınca kırmızı olsun
                onBlur={(e) => e.target.style.borderColor = '#eee'}
            />
        </div>
      </div>

      {/* BAŞLIK */}
      <h2 style={{ textAlign: 'center', color: '#2D3436', marginBottom: '30px', fontSize: '2em' }}>Restoran Seçimi</h2>

      {/* 👇 4. RESTORAN KARTLARI (ARTIK FİLTRELİ LİSTEYİ DÖNÜYORUZ) */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '30px',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
      }}>
        {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
            <div key={restaurant.id} style={{ 
                border: '1px solid #eee', 
                padding: '30px', 
                borderRadius: '20px', 
                background: '#fff', 
                boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.05)';
            }}
            >
                <div style={{ marginBottom: '20px', background: '#fff5f5', padding: '20px', borderRadius: '50%' }}>
                    <img 
                        src={restaurant.imageUrl || "https://cdn-icons-png.flaticon.com/512/4359/4359642.png"} 
                        alt={restaurant.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'contain' }} 
                    />
                </div>

                <h3 style={{ margin: '10px 0', color: '#2D3436', fontSize: '1.5em' }}>{restaurant.name}</h3>
                <p style={{ color: '#636e72', marginBottom: '25px' }}>{restaurant.description || "Özel soslu, el yapımı taze lezzetler."}</p>
                
                <button 
                onClick={() => navigate(`/menu/${restaurant.id}`)}
                style={{ 
                    background: '#ff0000', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px 25px', 
                    borderRadius: '30px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 10px rgba(255, 0, 0, 0.3)'
                }}
                >
                Menüyü İncele ➡
                </button>
            </div>
            ))
        ) : (
            // Arama sonucu bulunamazsa
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#777', padding: '50px' }}>
                <h3>😔 Aradığınız kriterde restoran bulunamadı.</h3>
            </div>
        )}
      </div>
    </div>
  );
}