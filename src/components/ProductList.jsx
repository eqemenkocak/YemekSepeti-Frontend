import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { id } = useParams(); // URL'deki ID'yi (örn: 1) kapar
  const navigate = useNavigate();

  useEffect(() => {
    // DİKKAT: Backend port numaranı kontrol et (7197 mi?)
    axios.get(`https://localhost:7197/api/Products/ByRestaurant/${id}`)
      .then(response => setProducts(response.data))
      .catch(error => {
        console.error(error);
        alert("Ürünler yüklenemedi!");
      });
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            marginBottom: '20px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
        }}
      >
        🔙 Restoranlara Dön
      </button>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Menü</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{ height: '150px', background: '#f9f9f9', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
              🍔
            </div>
            <h3>{product.name}</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#27ae60' }}>{product.price} TL</span>
              <button style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Sepete Ekle +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}