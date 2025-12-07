import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  // 👇 MODALIN AÇIK/KAPALI DURUMUNU TUTAN STATE
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  // 1. ADIM: Butona basılınca çalışır (Sadece kontrol yapar ve Modalı açar)
  const handleCheckoutClick = () => {
    if (cart.length === 0) return;

    if (!user) {
        alert("Sipariş vermek için lütfen önce giriş yapın!");
        navigate('/login');
        return;
    }

    // Her şey tamamsa Ödeme Penceresini aç
    setShowPaymentModal(true);
  };

  // 2. ADIM: Ödeme yöntemi seçilince çalışır ve Backend'e yollar
  const submitOrder = (selectedMethod) => {
    const orderData = {
        UserId: user.id,
        RestaurantId: cart[0].restaurantId, 
        ProductIds: cart.map(item => item.id),
        TotalAmount: totalAmount,
        PaymentMethod: selectedMethod // 👈 SEÇİLEN YÖNTEM BURADA GİDİYOR
    };

    axios.post('https://localhost:7197/api/Orders', orderData)
      .then(response => {
        // Modalı kapat
        setShowPaymentModal(false);
        alert("Siparişiniz Alındı! 🎉 (" + selectedMethod + " ile ödenecek)");
        clearCart();
        navigate('/');
      })
      .catch(error => {
        console.error("Hata:", error);
        alert("Sipariş oluşturulamadı!");
        setShowPaymentModal(false);
      });
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Sepetiniz Boş 😔</h2>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
            Restoranlara Git
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🛒 Sepetim</h2>

      {/* Ürün Listesi */}
      <div style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
        {cart.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <div>
                <strong>{item.name}</strong>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{item.description}</p>
            </div>
            <div style={{ fontWeight: 'bold', color: '#333' }}>{item.price} TL</div>
          </div>
        ))}
      </div>

      {/* Alt Toplam ve Butonlar */}
      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <h3>Toplam Tutar: <span style={{ color: '#ff4d4d' }}>{totalAmount} TL</span></h3>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button onClick={clearCart} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                🗑️ Sepeti Temizle
            </button>
            
            {user ? (
                <button 
                    onClick={handleCheckoutClick} // Direkt göndermiyoruz, fonksiyona gidiyoruz
                    style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                >
                    ✅ Siparişi Tamamla
                </button>
            ) : (
                <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    🔒 Giriş Yapmalısın
                </button>
            )}
        </div>
      </div>

      {/* 👇 ÖDEME SEÇİM PENCERESİ (MODAL) */}
      {showPaymentModal && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', // Arka planı karart
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)', textAlign: 'center', width: '350px'
            }}>
                <h3 style={{ marginTop: 0 }}>Ödeme Yöntemi Seçin 💳</h3>
                <p>Kapıda nasıl ödemek istersiniz?</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    
                    <button 
                        onClick={() => submitOrder('Kapıda Nakit')}
                        style={{ padding: '12px', background: '#2ECC71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                    >
                        💵 Kapıda Nakit
                    </button>

                    <button 
                        onClick={() => submitOrder('Kapıda Kredi Kartı')}
                        style={{ padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                    >
                        💳 Kapıda Kredi Kartı
                    </button>

                    <button 
                        onClick={() => setShowPaymentModal(false)}
                        style={{ marginTop: '10px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        İptal Et
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}