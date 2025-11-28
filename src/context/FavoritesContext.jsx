import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  // 👇 YENİ EKLENEN FONKSİYONLAR
  const openSidebar = () => setIsSidebarOpen(true);   // Paneli zorla aç
  const closeSidebar = () => setIsSidebarOpen(false); // Paneli zorla kapat
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Durumu tersine çevir

  return (
    <FavoritesContext.Provider value={{ 
        favorites, 
        toggleFavorite, 
        isFavorite, 
        isSidebarOpen, 
        toggleSidebar,
        openSidebar, // Dışarıya açtık
        closeSidebar // Dışarıya açtık
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);