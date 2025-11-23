import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const { addToCart } = useCart(); 

  useEffect(() => {
    // Backend portun 7197
    axios.get(`https://localhost:7197/api/Products/ByRestaurant/${id}`)
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')} style={{ padding: '10px', marginBottom: '20px', cursor: 'pointer' }}>
        🔙 Restoranlara Dön
      </button>

      <h2 style={{ textAlign: 'center' }}>Menü</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', background: '#fff' }}>
            
            {/* --- DEĞİŞİKLİK BURADA BAŞLIYOR --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>{product.name}</h3>
                
                {/* Puan Varsa Göster, Yoksa 'YENİ' Yaz */}
                {product.averageScore > 0 ? (
                    <span style={{ 
                        backgroundColor: '#fff3cd', 
                        color: '#856404', 
                        padding: '4px 8px', 
                        borderRadius: '5px', 
                        fontSize: '14px', 
                        fontWeight: 'bold',
                        border: '1px solid #ffeeba'
                    }}>
                        ★ {product.averageScore.toFixed(1)}
                    </span>
                ) : (
                    <span style={{ 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '5px', 
                        fontSize: '12px', 
                        fontWeight: 'bold'
                    }}>
                        YENİ
                    </span>
                )}
            </div>
            {/* --- DEĞİŞİKLİK BURADA BİTİYOR --- */}

            <p style={{ color: '#555' }}>{product.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <b style={{ fontSize: '1.1em', color: '#333' }}>{product.price} TL</b>
              
              {/* BUTON */}
              <button 
                onClick={() => addToCart(product)}
                style={{ 
                  background: '#ff4d4d', color: 'white', border: 'none', 
                  padding: '8px 15px', borderRadius: '5px', cursor: 'pointer',
                  fontWeight: 'bold' 
                }}
              >
                Sepete Ekle +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}