import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }

    axios.get(`https://localhost:7197/api/Orders/ByCustomer/${user.id}`)
      .then(res => {
          setOrders(res.data);
      })
      .catch(err => console.error(err));
  }, []);

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
            body: JSON.stringify({ productId: productId, orderId: orderId, score: score })
        });

        if (response.ok) {
            alert("Puanınız kaydedildi, teşekkürler! ⭐");
            // Sayfayı yenilemeye gerek yok, buton zaten kalıyor ama istersen yenileyebilirsin
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Bir hata oluştu.");
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("Sunucuya bağlanılamadı.");
    }
  };

  const getStatusColor = (status) => {
      if (status === 'Teslim Edildi') return '#2ecc71'; 
      if (status === 'İptal Edildi') return '#e74c3c'; 
      if (status === 'Yola Çıktı') return '#f39c12'; 
      return '#3498db'; 
  };

  // 👇 ÖZET HESAPLAMALARI
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2D3436' }}>📦 Sipariş Geçmişim</h2>

      {/* 👇 YENİ EKLENEN ÖZET KISMI (DASHBOARD) */}
      {orders.length > 0 && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #74b9ff, #0984e3)', color: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: 0, fontSize: '2em' }}>{totalOrders}</h3>
                <span style={{ opacity: 0.9, fontWeight: '500' }}>Toplam Sipariş</span>
            </div>

            <div style={{ flex: 1, background: 'linear-gradient(135deg, #55efc4, #00b894)', color: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: 0, fontSize: '2em' }}>{totalSpent} TL</h3>
                <span style={{ opacity: 0.9, fontWeight: '500' }}>Toplam Harcama</span>
            </div>

        </div>
      )}

      {/* LİSTELEME KISMI */}
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#777', marginTop: '50px' }}>
            <h3>Henüz hiç sipariş vermedin 😔</h3>
            <button 
                onClick={() => navigate('/')} 
                style={{ marginTop:'10px', padding: '12px 25px', cursor: 'pointer', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '1em' }}
            >
                Hemen Sipariş Ver
            </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #e0e0e0', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', background: 'white' }}>
                    
                    {/* Başlık */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '15px' }}>
                        <div>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2D3436' }}>{order.restaurantName}</span>
                            <span style={{ fontSize: '0.85rem', color: '#95a5a6', marginLeft: '10px' }}>#{order.id}</span>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#ff4d4d', fontSize: '1.1rem' }}>{order.totalAmount} TL</div>
                    </div>

                    {/* Müşteri & Adres Bilgisi */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', color: '#555' }}>
                        <div style={{ marginBottom: '4px' }}>👤 <b>Teslim Alan:</b> {order.customerName}</div>
                        <div>📍 <b>Adres:</b> {order.addressTitle ? `${order.addressTitle} - ` : ''} {order.addressText}</div>
                    </div>

                    {/* Ödeme Yöntemi */}
                    <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#636e72' }}>
                        💳 <b>Ödeme:</b> <span style={{ color: '#2980b9', fontWeight: 'bold' }}>{order.paymentMethod || "Kapıda Ödeme"}</span>
                    </div>

                    {/* İçerik */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#636e72', fontSize: '1rem' }}>🍽️ Menü:</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {order.items?.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
                                    <span style={{ fontWeight: '500', color: '#2d3436' }}>{item.productName || item}</span>
                                    
                                    {order.status === 'Teslim Edildi' && (
                                        <button 
                                            onClick={() => handleRateClick(item.productId, order.id)}
                                            style={{
                                                backgroundColor: '#f1c40f', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            ⭐ Puan Ver
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Durum */}
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', backgroundColor: getStatusColor(order.status), color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {order.status}
                        </span>
                    </div>

                </div>
            ))}
        </div>
      )}
    </div>
  );
}