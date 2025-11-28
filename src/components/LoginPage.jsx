import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  // --- GİRİŞ STATE ---
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // --- KAYIT STATE (ADRES EKLENDİ) ---
  const [registerData, setRegisterData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    phone: '',
    address: '' // 👈 Yeni alan
  });

  // GİRİŞ FONKSİYONU
  const handleLogin = () => {
    axios.post('https://localhost:7197/api/Auth/login', loginData)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        window.location.href = '/'; 
      })
      .catch(() => alert("Giriş Başarısız! Şifre veya Email yanlış."));
  };

  // KAYIT FONKSİYONU
  const handleRegister = () => {
    if(!registerData.fullName || !registerData.email || !registerData.password) {
        alert("Lütfen zorunlu alanları doldurun!");
        return;
    }

    axios.post('https://localhost:7197/api/Auth/register', registerData)
      .then(() => {
        alert("Kayıt Başarılı! 🎉 Lütfen sol taraftan giriş yapın.");
        setRegisterData({ fullName: '', email: '', password: '', phone: '', address: '' });
      })
      .catch(err => {
        alert(err.response?.data?.message || "Kayıt olurken bir hata oluştu.");
      });
  };

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        gap: '50px', 
        marginTop: '50px',
        flexWrap: 'wrap'
    }}>

      {/* SOL KUTU: GİRİŞ YAP (Değişmedi) */}
      <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>🔐 Giriş Yap</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="E-posta" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <input type="password" placeholder="Şifre" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <button onClick={handleLogin} style={{ marginTop: '10px', padding: '12px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>GİRİŞ YAP</button>
        </div>
      </div>

      {/* SAĞ KUTU: KAYIT OL (Adres Eklendi) */}
      <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '15px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
          width: '350px', 
          textAlign: 'center',
          borderTop: '5px solid #2ECC71' 
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>📝 Yeni Üye Ol</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
                placeholder="Ad Soyad" 
                value={registerData.fullName}
                onChange={e => setRegisterData({...registerData, fullName: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            <input 
                placeholder="E-posta" 
                value={registerData.email}
                onChange={e => setRegisterData({...registerData, email: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            <input 
                placeholder="Telefon" 
                value={registerData.phone}
                onChange={e => setRegisterData({...registerData, phone: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            
            {/* 👇 YENİ ADRES KUTUSU */}
            <textarea 
                placeholder="Açık Adres (Sipariş için)" 
                value={registerData.address}
                onChange={e => setRegisterData({...registerData, address: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical', minHeight: '60px', fontFamily: 'inherit' }}
            />

            <input 
                type="password" 
                placeholder="Şifre Belirle" 
                value={registerData.password}
                onChange={e => setRegisterData({...registerData, password: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            <button 
                onClick={handleRegister} 
                style={{ marginTop: '10px', padding: '12px', background: '#2ECC71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
                KAYIT OL
            </button>
        </div>
      </div>

    </div>
  );
}