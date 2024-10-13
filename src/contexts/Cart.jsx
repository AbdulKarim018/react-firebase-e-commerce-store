import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export default function CartContextProvider({ children }) {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || [],
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const productIndex = cart.findIndex((p) => p.id === product.id);

    if (productIndex === -1) {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    } else {
      cart[productIndex].quantity++;
      setCart((prevCart) => [...prevCart]);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== productId));
  };

  const getNmbrOfItemsInCart = () => {
    return cart.reduce((acc, product) => acc + product.quantity, 0);
  };

  const clearCart = () => setCart([]);

  const getCartPrice = () => {
    const total = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );
    return total.toFixed(2);
  };

  const cartPrice = useMemo(() => getCartPrice(), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        getNmbrOfItemsInCart,
        clearCart,
        getCartPrice,
        cartPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const cart = useContext(CartContext);
  return cart;
};
