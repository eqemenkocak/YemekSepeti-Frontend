import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = () => {
    axios.post('https://localhost:7197/api/Auth/Login', { email, password })
      .then(res => {
        console.log("SUNUCUDAN GELEN:", res.data); // Konsola yazdıralım

        // 1. Hem Büyük 'R' hem Küçük 'r' kontrolü yapalım (Garanti olsun)
        const gelenRol = res.data.role || res.data.Role;

        // 2. Rol boş gelirse hata ver
        if (!gelenRol) {
            alert("HATA: Rol bilgisi okunamadı! Konsola bak.");
            return;
        }

        // 3. Boşlukları temizleyip kontrol et (.trim())
        if (gelenRol.trim() === 'RestaurantOwner') {
            alert("Patron Girişi Başarılı! Admin Paneline Yönlendiriliyorsunuz...");
            localStorage.setItem('user', JSON.stringify(res.data));
            // Admin rotasına git
            navigate('/admin'); 
        } else {
            // Eğer rol tutmazsa ne geldiğini görelim
            alert("Giriş Başarılı ama Yetki Yok! Gelen Rol: " + gelenRol);
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/');
        }
      })
      .catch((err) => {
          console.error(err);
          alert("Giriş Başarısız! Şifre veya Email yanlış.");
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>🔐 Restoran Girişi</h2>
      <input 
        placeholder="E-posta" 
        value={email} 
        onChange={e => setEmail(e.target.value)}
        style={{ width: '90%', padding: '10px', marginBottom: '10px' }}
      />
      <input 
        type="password"
        placeholder="Şifre" 
        value={password} 
        onChange={e => setPassword(e.target.value)}
        style={{ width: '90%', padding: '10px', marginBottom: '20px' }}
      />
      <button 
        onClick={handleLogin}
        style={{ width: '100%', padding: '10px', background: '#ff4d4d', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        GİRİŞ YAP
      </button>
    </div>
  );
}