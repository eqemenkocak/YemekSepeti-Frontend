import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Yeni yemek ekleme state'leri
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'RestaurantOwner') {
        navigate('/login');
        return;
    }
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = () => {
    axios.get(`https://localhost:7197/api/Orders/ByRestaurant/${user.restaurantId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const fetchProducts = () => {
    axios.get(`https://localhost:7197/api/Products/ByRestaurant/${user.restaurantId}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const handleStatusUpdate = (id, newStatus) => {
    axios.put(`https://localhost:7197/api/Orders/UpdateStatus/${id}`, { status: newStatus })
      .then(() => {
        alert("Durum güncellendi!");
        fetchOrders();
      })
      .catch(err => alert("Hata oluştu!"));
  };

  const handleAddProduct = () => {
    const productData = {
        restaurantId: user.restaurantId,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        categoryId: 1 
    };

    axios.post('https://localhost:7197/api/Products', productData)
        .then(() => {
            alert("Yemek eklendi!");
            setNewProduct({ name: '', price: '', description: '' });
            fetchProducts();
        })
        .catch(err => alert("Ekleme başarısız!"));
  };

  const handleDeleteProduct = (id) => {
      if(window.confirm("Bu ürünü silmek istediğine emin misin?")) {
          axios.delete(`https://localhost:7197/api/Products/${id}`)
              .then(() => { fetchProducts(); })
              .catch(err => alert("Silinemedi!"));
      }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: 0, color: '#333' }}>
            👋 Hoşgeldin, <span style={{ color: '#d63031' }}>{user?.fullName || user?.FullName}</span>
        </h2>
        <div>
             <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer', border: '1px solid #ddd', background: 'white', borderRadius: '5px', fontWeight: 'bold', color: '#555' }}>
                🏠 Anasayfa'ya Git
             </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* SOL KOLON: YEMEK YÖNETİMİ */}
        <div style={{ flex: 1 }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h3 style={{ marginTop: 0, color: '#6c5ce7' }}>➕ Yemek Ekle</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input placeholder="Yemek Adı" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
                    <input placeholder="Fiyat" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
                    <input placeholder="Açıklama" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
                    <button onClick={handleAddProduct} style={{ background: '#00b894', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>KAYDET</button>
                </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0 }}>📋 Menüm</h3>
                {products.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                        <span>{p.name} ({p.price} TL)</span>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#ff7675', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Sil</button>
                    </div>
                ))}
            </div>
        </div>

        {/* SAĞ KOLON: SİPARİŞLER */}
        <div style={{ flex: 2 }}>
            <h3 style={{ marginTop: 0 }}>📦 Gelen Siparişler</h3>
            
            {orders.length === 0 ? <p>Henüz sipariş yok.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map(order => (
                        <div key={order.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #0984e3', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Sipariş #{order.id}</span>
                                <span style={{ color: 'green', fontWeight: 'bold' }}>{order.totalAmount} TL</span>
                            </div>

                            <div style={{ backgroundColor: '#f1f2f6', padding: '10px', borderRadius: '5px', marginBottom: '10px', fontSize: '0.9em' }}>
                                <div>👤 <b>Müşteri:</b> {order.customerName}</div>
                                <div style={{ marginTop: '5px' }}>📍 <b>Adres:</b> {order.addressText}</div>
                            </div>

                            {/* --- İÇERİK VE PUAN GÖSTERİMİ (GÜNCELLENDİ) --- */}
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ color: '#636e72', marginBottom: '5px' }}>🍽️ <b>İçerik:</b></div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ 
                                            border: '1px solid #eee', 
                                            padding: '5px 10px', 
                                            borderRadius: '15px', 
                                            backgroundColor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            fontSize: '0.9em'
                                        }}>
                                            <span>{item.name}</span>
                                            {/* Eğer Puan Varsa (0'dan büyükse) Göster */}
                                            {item.score > 0 && (
                                                <span style={{ 
                                                    backgroundColor: '#ffeaa7', 
                                                    color: '#d35400', 
                                                    padding: '2px 6px', 
                                                    borderRadius: '10px', 
                                                    fontWeight: 'bold',
                                                    fontSize: '0.85em'
                                                }}>
                                                    ★ {item.score}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* ---------------------------------------------- */}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.9em' }}>Durum:</span>
                                <select 
                                    value={order.status} 
                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd', flex: 1 }}
                                >
                                    <option value="Bekleniyor...">⏳ Bekleniyor...</option>
                                    <option value="Hazırlanıyor">🔥 Hazırlanıyor</option>
                                    <option value="Yola Çıktı">🛵 Yola Çıktı</option>
                                    <option value="Teslim Edildi">✅ Teslim Edildi</option>
                                    <option value="İptal Edildi">❌ İptal Edildi</option>
                                </select>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}