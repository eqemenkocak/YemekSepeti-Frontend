import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // 1. Giriş yapan kullanıcıyı bul
  const user = JSON.parse(localStorage.getItem('user'));

  // 2. KİŞİYE ÖZEL ANAHTAR OLUŞTUR 🔑
  // Eğer kullanıcı varsa "favorites_12", yoksa "favorites_guest" anahtarını kullanırız.
  const storageKey = user ? `favorites_${user.id}` : 'favorites_guest';

  const [favorites, setFavorites] = useState(() => {
    // Hafızadan okurken dinamik anahtarı kullanıyoruz
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 3. Kaydederken de o anahtara kaydet
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, storageKey]);

  const toggleFavorite = (product) => {
    const exists = favorites.find(item => item.id === product.id);
    if (exists) {
      setFavorites(favorites.filter(item => item.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <FavoritesContext.Provider value={{ 
        favorites, 
        toggleFavorite, 
        isFavorite, 
        isSidebarOpen, 
        toggleSidebar,
        openSidebar,
        closeSidebar 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);