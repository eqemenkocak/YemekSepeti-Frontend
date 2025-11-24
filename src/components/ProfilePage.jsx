import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '' // Boş bırakırsa değişmez
  });

  useEffect(() => {
    if (!localUser) {
        navigate('/login');
        return;
    }

    // Backend'den güncel bilgileri çek
    axios.get(`https://localhost:7197/api/Users/${localUser.id}`)
        .then(res => {
            setFormData({
                fullName: res.data.fullName,
                email: res.data.email,
                phone: res.data.phone || '', // Telefon boş olabilir
                password: ''
            });
        })
        .catch(err => console.error("Bilgiler çekilemedi", err));
  }, []);

  const handleUpdate = () => {
    axios.put(`https://localhost:7197/api/Users/${localUser.id}`, formData)
        .then(res => {
            alert("Bilgileriniz güncellendi! ✅");
            
            // LocalStorage'ı da güncelle ki Navbar'daki isim hemen değişsin
            const updatedUser = { ...localUser, fullName: formData.fullName, email: formData.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Sayfayı yenile (Navbar güncellensin diye)
            window.location.reload();
        })
        .catch(err => alert("Güncelleme başarısız!"));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>👤 Profil Bilgilerim</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        <label>Ad Soyad:</label>
        <input 
            value={formData.fullName} 
            onChange={e => setFormData({...formData, fullName: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label>Email:</label>
        <input 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label>Telefon:</label>
        <input 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label>Yeni Şifre (Değiştirmek istemiyorsan boş bırak):</label>
        <input 
            type="password"
            placeholder="******"
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button 
            onClick={handleUpdate}
            style={{ marginTop: '10px', padding: '12px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
            GÜNCELLE
        </button>

        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>
            İptal
        </button>

      </div>
    </div>
  );
}