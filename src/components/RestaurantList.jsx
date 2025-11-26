import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// 👇 1. LOGOYU IMPORT EDİYORUZ
import logoImg from '../assets/sitelogo.png';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const displayName = user ? (user.fullName || user.email) : "Misafir";

  useEffect(() => {
    axios.get('https://localhost:7197/api/Restaurants')
      .then(response => setRestaurants(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      {/* 👇 KIRMIZI BANNER ALANI */}
      <div style={{ 
        backgroundColor: '#ff0000', 
        color: 'white',
        padding: '60px 20px',
        // Flexbox ile yan yana diziyoruz
        display: 'flex',
        justifyContent: 'center', // Yatayda ortala
        alignItems: 'center',     // Dikeyde ortala
        gap: '30px',              // Logo ile yazı arasındaki boşluk
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '40px'
      }}>
        
        {/* SOL TARAFTAKİ LOGO */}
        <img 
            src={logoImg} 
            alt="TıklaYe Logo" 
            style={{ 
                height: '160px', // Logonun boyutu (Büyükçe)
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' // Hafif gölge
            }} 
        />

        {/* SAĞ TARAFTAKİ YAZILAR */}
        <div style={{ textAlign: 'left' }}> {/* Yazıları sola yasladık */}
            <h1 style={{ 
                margin: 0, 
                fontSize: '5em', // Yazıyı iyice büyüttük
                fontWeight: '800',
                fontFamily: "'Poppins', sans-serif",
                lineHeight: '1',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                TIKLA YE
            </h1>
            <p style={{ 
                margin: '10px 0 0 5px', 
                fontSize: '2em', 
                fontWeight: '400',
                opacity: 0.95,
                fontFamily: "'Poppins', sans-serif",
            }}>
                Lezzet Kapında
            </p>
        </div>
      </div>

      {/* HOŞGELDİN MESAJI */}
      {user && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 30px auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ fontSize: '1.5em' }}>👋</span> 
             <h2 style={{ margin: 0, color: '#2D3436' }}>Hoşgeldin, <span style={{ color: '#ff0000' }}>{displayName}</span></h2>
        </div>
      )}

      <h2 style={{ textAlign: 'center', color: '#2D3436', marginBottom: '30px', fontSize: '2em' }}>Restoran Seçimi</h2>

      {/* RESTORAN KARTLARI */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '30px',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
      }}>
        {restaurants.map(restaurant => (
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
                <img src="https://cdn-icons-png.flaticon.com/512/4359/4359642.png" alt="Restoran İkon" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
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
        ))}
      </div>
    </div>
  );
}