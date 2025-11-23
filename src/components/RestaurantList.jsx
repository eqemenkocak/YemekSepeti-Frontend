import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Backend'den restoranları çekiyoruz
    axios.get('https://localhost:7197/api/Restaurants')
      .then(response => {
        setRestaurants(response.data);
        // Debug için konsola bakalım, puanlar geliyor mu?
        console.log("Restoranlar:", response.data);
      })
      .catch(error => console.error("Hata oluştu:", error));
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '30px 0', color: '#333' }}>Restoran Seçimi</h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '25px', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        padding: '0 20px'
      }}>
        {restaurants.map(rest => (
          <div key={rest.id} 
               onClick={() => navigate(`/menu/${rest.id}`)}
               style={{ 
                 border: '1px solid #e0e0e0', 
                 borderRadius: '15px',
                 padding: '20px', 
                 width: '320px',
                 boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                 cursor: 'pointer',
                 backgroundColor: '#fff',
                 transition: 'transform 0.2s, box-shadow 0.2s',
                 position: 'relative',
                 overflow: 'hidden'
               }}
               onMouseOver={(e) => {
                   e.currentTarget.style.transform = 'translateY(-5px)';
                   e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
               }}
               onMouseOut={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
               }}
          >
            <div style={{ fontSize: '50px', textAlign: 'center', marginBottom: '10px' }}>🍽️</div>
            
            {/* İSİM ve PUAN KISMI */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '1.4rem' }}>{rest.name}</h3>
                
                {/* Puan Varsa Göster, Yoksa 'Yeni' Yaz */}
                {rest.averageScore > 0 ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        border: '1px solid #ffeeba'
                    }}>
                        <span style={{ marginRight: '4px', color: '#ffc107' }}>★</span> 
                        {rest.averageScore.toFixed(1)}
                    </div>
                ) : (
                    <span style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                        Yeni
                    </span>
                )}
            </div>

            <p style={{ color: '#7f8c8d', textAlign: 'center', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {rest.description}
            </p>
            
            <div style={{ 
              marginTop: '20px', 
              textAlign: 'center', 
              fontWeight: '600', 
              color: '#ff4757',
              borderTop: '1px solid #f1f1f1',
              paddingTop: '15px'
            }}>
              Menüyü İncele ➡️
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}