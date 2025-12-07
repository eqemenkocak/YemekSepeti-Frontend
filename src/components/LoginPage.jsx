import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [registerData, setRegisterData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    phone: '',
    address: '' 
  });

  const handleLogin = () => {
    axios.post('https://localhost:7197/api/Auth/login', loginData)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        window.location.href = '/'; 
      })
      .catch(() => alert("Giriş Başarısız! Şifre veya Email yanlış."));
  };

  const handleRegister = () => {
    // 1. Boş Alan Kontrolü
    if(!registerData.fullName || !registerData.email || !registerData.password || !registerData.address) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    // 2. Telefon Numarası Kontrolü (11 Hane)
    if (registerData.phone.length !== 11) {
        alert("Telefon numarası başında 0 olacak şekilde tam 11 hane olmalıdır! (Örn: 0555...)");
        return;
    }

    axios.post('https://localhost:7197/api/Auth/register', registerData)
      .then(() => {
        alert("Kayıt Başarılı! 🎉 Lütfen sol taraftan giriş yapın.");
        setRegisterData({ fullName: '', email: '', password: '', phone: '', address: '' });
      })
      .catch(err => {
        // 👇 BACKEND'DEN GELEN "ZATEN KAYITLI" MESAJINI BURADA GÖSTERİYORUZ
        const errorMessage = err.response?.data?.message || "Kayıt olurken bir hata oluştu.";
        alert("❌ HATA: " + errorMessage);
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

      {/* SOL KUTU: GİRİŞ YAP */}
      <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>🔐 Giriş Yap</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="E-posta" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <input type="password" placeholder="Şifre" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <button onClick={handleLogin} style={{ marginTop: '10px', padding: '12px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>GİRİŞ YAP</button>
        </div>
      </div>

      {/* SAĞ KUTU: KAYIT OL */}
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
                type="tel"
                placeholder="Telefon (05...)" 
                value={registerData.phone}
                maxLength={11} 
                onChange={e => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    setRegisterData({...registerData, phone: onlyNums});
                }}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            
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