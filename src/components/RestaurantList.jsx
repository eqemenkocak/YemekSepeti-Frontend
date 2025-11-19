import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // Sayfa değiştirmek için kullanacağız

  useEffect(() => {
    // Backend'den restoranları çekiyoruz
    axios.get('https://localhost:7197/api/Restaurants')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => console.error("Hata oluştu:", error));
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Restoran Seçimi</h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center', 
        flexWrap: 'wrap' 
      }}>
        {restaurants.map(rest => (
          <div key={rest.id} 
               onClick={() => navigate(`/menu/${rest.id}`)} // Tıklayınca menüye git
               style={{ 
                 border: '1px solid #ddd', 
                 borderRadius: '10px',
                 padding: '20px', 
                 width: '300px',
                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                 cursor: 'pointer',
                 backgroundColor: '#fff',
                 transition: 'transform 0.2s'
               }}
               onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '40px', textAlign: 'center' }}>🍽️</div>
            <h3 style={{ textAlign: 'center', color: '#333' }}>{rest.name}</h3>
            <p style={{ color: '#666', textAlign: 'center' }}>{rest.description}</p>
            <div style={{ 
              marginTop: '15px', 
              textAlign: 'center', 
              fontWeight: 'bold', 
              color: '#ff4d4d' 
            }}>
              Menüyü İncele ➡️
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}