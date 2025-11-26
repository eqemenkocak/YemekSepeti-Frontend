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
    axios.get(`https://localhost:7197/api/Products/ByRestaurant/${id}`)
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, [id]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <button 
        onClick={() => navigate('/')} 
        style={{ 
            padding: '10px 20px', 
            marginBottom: '20px', 
            cursor: 'pointer', 
            border:'1px solid #ddd', 
            background:'white', 
            borderRadius:'8px',
            fontWeight: '600',
            color: '#555'
        }}>
        🔙 Restoranlara Dön
      </button>

      <h2 style={{ textAlign: 'center', color: '#2D3436', marginBottom: '30px' }}>Menü</h2>

      {/* 👇 DEĞİŞİKLİK BURADA: 250px YERİNE 340px YAPTIK */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '25px' 
      }}>
        {products.map(product => (
          <div key={product.id} style={{ 
              border: '1px solid #eee', 
              padding: '25px', // İç boşluğu biraz artırdık ferah olsun
              borderRadius: '15px', 
              background: '#fff', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '180px' // Kartların boyu eşit dursun diye
          }}>
            
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    {/* İsim alanı artık daha geniş */}
                    <h3 style={{ margin: 0, color: '#2D3436', fontSize: '1.3rem' }}>{product.name}</h3>
                    
                    {product.averageScore > 0 ? (
                        <span style={{ 
                            backgroundColor: '#fff3cd', 
                            color: '#FFA502', 
                            padding: '4px 8px', 
                            borderRadius: '5px', 
                            fontSize: '14px', 
                            fontWeight: 'bold', 
                            border: '1px solid #ffeeba',
                            whiteSpace: 'nowrap' // Yıldız aşağı kaymasın
                        }}>
                            ★ {product.averageScore.toFixed(1)}
                        </span>
                    ) : (
                        <span style={{ 
                            backgroundColor: '#2ECC71', 
                            color: 'white', 
                            padding: '4px 8px', 
                            borderRadius: '5px', 
                            fontSize: '10px', 
                            fontWeight: 'bold' 
                        }}>
                            YENİ
                        </span>
                    )}
                </div>

                <p style={{ color: '#636e72', fontSize: '0.95em', lineHeight: '1.5' }}>{product.description}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px' }}>
              <b style={{ fontSize: '1.4em', color: '#2D3436' }}>{product.price} TL</b>
              
              <button 
                onClick={() => addToCart(product)}
                style={{ 
                  background: '#2ECC71', 
                  color: 'white', border: 'none', 
                  padding: '12px 24px', // Butonu da biraz büyüttük
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px rgba(46, 204, 113, 0.3)' 
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