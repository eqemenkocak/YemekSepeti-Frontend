import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; // Hafızayı çağır

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const { addToCart } = useCart(); // Ekleme fonksiyonunu al

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
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px' }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <b>{product.price} TL</b>
              
              {/* BUTON */}
              <button 
                onClick={() => addToCart(product)}
                style={{ 
                  background: '#ff4d4d', color: 'white', border: 'none', 
                  padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' 
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