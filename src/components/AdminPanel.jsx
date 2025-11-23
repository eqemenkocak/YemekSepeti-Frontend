import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); 
  
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: 1    
  });

  useEffect(() => {
    if (!user || user.role !== 'RestaurantOwner') {
        alert("Lütfen önce giriş yapın!");
        navigate('/login');
        return;
    }
    loadMyData();
  }, []);

  const loadMyData = () => {
    // Ürünleri Getir
    axios.get(`https://localhost:7197/api/Products/ByRestaurant/${user.restaurantId}`)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));

    // Siparişleri Getir
    axios.get(`https://localhost:7197/api/Orders/ByRestaurant/${user.restaurantId}`)
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  };

  // SİPARİŞ DURUMUNU DEĞİŞTİRME FONKSİYONU 🚀
  const changeStatus = (orderId, newStatus) => {
      axios.put(`https://localhost:7197/api/Orders/UpdateStatus/${orderId}`, { status: newStatus })
        .then(() => {
            const updatedOrders = orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
        })
        .catch(err => alert("Durum güncellenemedi: " + err));
  };

  const handleAdd = () => {
    const newProduct = { ...form, price: parseFloat(form.price), restaurantId: user.restaurantId, categoryId: 1 };
    axios.post('https://localhost:7197/api/Products', newProduct).then(() => { loadMyData(); setForm({...form, name: '', price: '', description: ''}); });
  };

  const handleDelete = (id) => {
    if(window.confirm("Silmek istiyor musun?")) axios.delete(`https://localhost:7197/api/Products/${id}`).then(() => loadMyData());
  };

  if (!user) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ÜST BAŞLIK (BUTON KALDIRILDI) */}
      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>👋 Hoşgeldin, {user.name}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          
          {/* SOL: ÜRÜN YÖNETİMİ */}
          <div>
            <h3>➕ Yemek Ekle</h3>
            <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '10px' }}>
                <input placeholder="Yemek Adı" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ display: 'block', width: '90%', marginBottom: '10px', padding: '8px' }} />
                <input placeholder="Fiyat" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={{ display: 'block', width: '90%', marginBottom: '10px', padding: '8px' }} />
                <input placeholder="Açıklama" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ display: 'block', width: '90%', marginBottom: '10px', padding: '8px' }} />
                <button onClick={handleAdd} style={{ background: 'green', color: 'white', padding: '10px', width: '100%', border: 'none', cursor: 'pointer' }}>KAYDET</button>
            </div>
            
            <ul style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                {products.map(p => (
                    <li key={p.id} style={{ borderBottom: '1px solid #ddd', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{p.name} ({p.price} TL)</span>
                        <button onClick={() => handleDelete(p.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Sil</button>
                    </li>
                ))}
            </ul>
          </div>

          {/* SAĞ: SİPARİŞ YÖNETİMİ */}
          <div>
              <h3>📦 Gelen Siparişler</h3>
              <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '10px', height: '600px', overflowY: 'auto' }}>
                {orders.length === 0 ? <p>Henüz sipariş yok.</p> : orders.map(order => (
                    <div key={order.id} style={{ background: 'white', padding: '15px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #bcd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '5px' }}>
                            <strong>Sipariş #{order.id}</strong>
                            <span style={{ color: 'green', fontWeight: 'bold' }}>{order.totalAmount} TL</span>
                        </div>

                        <div style={{ fontSize: '14px', color: '#555', marginBottom: '10px' }}>
                            🍽️ <b>İçerik:</b> {order.items.join(", ")}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f9f9f9', padding: '5px', borderRadius: '5px' }}>
                            <span style={{ fontSize: '14px' }}>Durum:</span>
                            <select 
                                value={order.status} 
                                onChange={(e) => changeStatus(order.id, e.target.value)}
                                style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', flex: 1, fontWeight: 'bold', color: order.status === 'Teslim Edildi' ? 'green' : 'orange' }}
                            >
                                <option value="Bekleniyor...">⏳ Bekleniyor...</option>
                                <option value="Hazırlanıyor">👨‍🍳 Hazırlanıyor</option>
                                <option value="Yola Çıktı">🏍️ Kurye Yola Çıktı</option>
                                <option value="Teslim Edildi">✅ Teslim Edildi</option>
                                <option value="İptal Edildi">❌ İptal Edildi</option>
                            </select>
                        </div>

                    </div>
                ))}
              </div>
          </div>
      </div>
    </div>
  );
}