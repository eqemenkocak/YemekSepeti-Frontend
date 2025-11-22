import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); 

  const addToCart = (product) => {
    // 1. KONTROL: Sepet boşsa direkt ekle
    if (cart.length === 0) {
        setCart([product]);
        alert(product.name + " sepete eklendi! 🛒");
        return;
    }

    // 2. KONTROL: Sepetteki ürünlerin restoranı ile yeni ürünün restoranı aynı mı?
    const currentRestaurantId = cart[0].restaurantId; // Sepetin sahibi kim?

    if (product.restaurantId === currentRestaurantId) {
        // Aynı restoran, eklemeye devam et
        setCart((prev) => [...prev, product]); 
        alert(product.name + " sepete eklendi! 🛒");
    } else {
        // 3. FARKLI RESTORAN UYARISI 🚨
        if (window.confirm("Sepetinizde başka bir restoranın ürünleri var. Sepeti temizleyip bu ürünü eklemek ister misiniz?")) {
            setCart([product]); // Sepeti sil ve yenisini ekle
            alert("Sepet temizlendi ve yeni ürün eklendi! ✅");
        }
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const values = {
    cart,
    addToCart,
    clearCart
  };

  return (
    <CartContext.Provider value={values}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);