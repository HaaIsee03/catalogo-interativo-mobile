import { createContext, useContext, useState } from 'react';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Adicionar item ao carrinho (agora aceita quantidade)
  const addToCart = (product, quantity = 1) => {
    setCart(currentCart => {
      const itemExists = currentCart.find(item => item.id === product.id);

      if (itemExists) {
        // Se já existe, apenas aumenta a quantidade
        return currentCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Se não existe, adiciona com a quantidade escolhida
      return [...currentCart, { ...product, quantity }];
    });
  };

  // Remover item
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // NOVA FUNÇÃO: Limpar o carrinho
  const clearCart = () => {
    setCart([]);
  };

  // Calcular total considerando a quantidade
  const cartTotal = cart.reduce((total, item) => {
    return total + ((item.price * 5.5) * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}