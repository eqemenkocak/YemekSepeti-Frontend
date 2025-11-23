import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Güvenlik: Giriş yapmamışsa Login'e at
    if (!user) {
        navigate('/login');
        return;
    }

    // Backend'den siparişleri çek
    axios.get(`https://localhost:7197/api/Orders/ByCustomer/${user.id}`)
      .then(res => {
          setOrders(res.data);
          // Debug için konsola basalım, items içinde productId geliyor mu görelim
          console.log("Gelen Siparişler:", res.data); 
      })
      .catch(err => console.error(err));
  }, []);

  // Puan Verme Fonksiyonu (Backend'e istek atar)
  const handleRateClick = async (productId, orderId) => {
    const scoreStr = prompt("Bu yemeğe 1 ile 5 arasında kaç puan verirsiniz?");
    if (!scoreStr) return;

    const score = parseInt(scoreStr);

    if (isNaN(score) || score < 1 || score > 5) {
        alert("Lütfen 1-5 arası geçerli bir sayı girin!");
        return;
    }

    try {
        const response = await fetch("https://localhost:7197/api/ratings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                productId: productId, 
                orderId: orderId, 
                score: score 
            })
        });

        if (response.ok) {
            alert("Puanınız kaydedildi, teşekkürler! ⭐");
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Bir hata oluştu.");
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("Sunucuya bağlanılamadı.");
    }
  };

  // Duruma göre renk veren fonksiyon 🎨
  const getStatusColor = (status) => {
      if (status === 'Teslim Edildi') return 'green';
      if (status === 'İptal Edildi') return 'red';
      if (status === 'Yola Çıktı') return 'orange';
      return '#333';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📦 Sipariş Geçmişim</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#777' }}>
            <h3>Henüz hiç sipariş vermedin 😔</h3>
            <button onClick={() => navigate('/')} style={{ marginTop:'10px', padding: '10px 20px', cursor: 'pointer' }}>Hemen Sipariş Ver</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: 'white' }}>
                    
                    {/* Başlık Kısmı */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                        <div>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{order.restaurantName}</span>
                            <span style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>Sipariş #{order.id}</span>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#ff4d4d' }}>{order.totalAmount} TL</div>
                    </div>

                    {/* Yemekler ve Puan Butonları */}
                    <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>🍽️ Menü:</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {/* DİKKAT: Burada order.items'ın içinde productId ve productName olması gerekiyor */}
                            {order.items && order.items.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9', padding: '8px', borderRadius: '5px' }}>
                                    
                                    {/* Ürün Adı */}
                                    {/* Eğer backend sadece string listesi ("Adana", "Kola") gönderiyorsa burası hata verebilir. Obje göndermeli. */}
                                    <span style={{ fontWeight: '500' }}>{item.productName || item}</span>
                                    
                                    {/* Puan Ver Butonu - Sadece Teslim Edildiyse */}
                                    {order.status === 'Teslim Edildi' && (
                                        <button 
                                            onClick={() => handleRateClick(item.productId, order.id)}
                                            style={{
                                                backgroundColor: '#ffc107',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                color: '#333'
                                            }}
                                        >
                                            ⭐ Puan Ver
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Durum Kutusu */}
                    <div style={{ display: 'inline-block', padding: '5px 15px', borderRadius: '20px', backgroundColor: '#f0f0f0', color: getStatusColor(order.status), fontWeight: 'bold', border: `1px solid ${getStatusColor(order.status)}` }}>
                        {order.status}
                    </div>

                </div>
            ))}
        </div>
      )}
    </div>
  );
}