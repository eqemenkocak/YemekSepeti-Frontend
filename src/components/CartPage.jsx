import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CartPage() {
  const { cart, clearCart } = useCart(); // Sepeti ve temizleme fonksiyonunu al
  const navigate = useNavigate();

  // 👇 1. GİRİŞ YAPAN KULLANICIYI HAFIZADAN AL
  const user = JSON.parse(localStorage.getItem('user'));

  // Toplam Tutar Hesaplama
  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // 👇 2. KONTROL: KULLANICI YOKSA UYAR VE LOGIN'E AT
    if (!user) {
        alert("Sipariş vermek için lütfen önce giriş yapın!");
        navigate('/login');
        return;
    }

    // Backend'e gidecek veriyi hazırla
    const orderData = {
        UserId: user.id, // 👈 ARTIK GERÇEK KULLANICI ID'Sİ
        RestaurantId: cart[0].restaurantId, 
        ProductIds: cart.map(item => item.id),
        TotalAmount: totalAmount
    };

    // Siparişi gönder
    axios.post('https://localhost:7197/api/Orders', orderData)
      .then(response => {
        alert("Siparişiniz Alındı! 🎉 Sipariş No: " + response.data.orderId);
        clearCart(); // Sepeti boşalt
        navigate('/'); // Anasayfaya dön
      })
      .catch(error => {
        console.error("Sipariş hatası:", error);
        alert("Sipariş oluşturulurken bir hata oluştu! (Konsola bak)");
      });
  };

  // Sepet boşsa gösterilecek ekran
  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Sepetiniz Boş 😔</h2>
        <button 
            onClick={() => navigate('/')}
            style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
        >
            Restoranlara Git
        </button>
      </div>
    );
  }

  // Sepet doluysa gösterilecek ekran
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
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
            <button 
                onClick={clearCart} 
                style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                🗑️ Sepeti Temizle
            </button>
            
            <button 
                onClick={handleCheckout}
                style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
            >
                ✅ Siparişi Tamamla
            </button>
        </div>
      </div>
    </div>
  );
}