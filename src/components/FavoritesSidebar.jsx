import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext'; 

export default function FavoritesSidebar() {
  const { favorites, toggleFavorite, isSidebarOpen, toggleSidebar } = useFavorites();
  const { addToCart } = useCart();

  return (
    <>
      {/* 1. KARARTMA PERDESİ (Overlay) */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1999
          }}
        />
      )}

      {/* 2. YAN PANEL */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isSidebarOpen ? '0' : '-400px', // Açıkken 0, kapalıyken gizli
        width: '350px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
        transition: 'right 0.3s ease-in-out',
        zIndex: 2000,
        padding: '20px',
        overflowY: 'auto'
      }}>
        
        {/* BAŞLIK VE KAPAT BUTONU */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <h2 style={{ margin: 0, color: '#2D3436' }}>💖 Favorilerim</h2>
            <button onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>❌</button>
        </div>

        {/* LİSTELEME */}
        {favorites.length === 0 ? (
            <p style={{ color: '#777', textAlign: 'center', marginTop: '50px' }}>Henüz favori ürünün yok.</p>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {favorites.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #eee', padding: '10px', borderRadius: '10px' }}>
                        
                        {/* Bilgiler */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>{item.name}</div>
                            <div style={{ color: '#2ECC71', fontWeight: 'bold' }}>{item.price} TL</div>
                        </div>

                        {/* Butonlar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <button 
                                onClick={() => addToCart(item)}
                                style={{ background: '#2ECC71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}
                            >
                                Sepete Ekle
                            </button>
                            <button 
                                onClick={() => toggleFavorite(item)}
                                style={{ background: '#ff7675', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}
                            >
                                Kaldır
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </>
  );
}