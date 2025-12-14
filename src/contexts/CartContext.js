import { createContext, useContext, useState } from 'react';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCart(currentCart => {
      const itemExists = currentCart.find(item => item.id === product.id);

      if (itemExists) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentCart, { ...product, quantity }];
    });
  };

  const increaseQuantity = (productId) => {
    setCart(cart =>
      cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart(cart =>
      cart
        .map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart => cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * 5.5 * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
