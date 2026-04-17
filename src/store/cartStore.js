import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (item) => {
        const { cartItems } = get();
        const existingItem = cartItems.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            cartItems: cartItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ cartItems: [...cartItems, { ...item, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, delta) => {
        const { cartItems } = get();
        set({
          cartItems: cartItems.map((item) => {
            if (item.id === id) {
              const newQuantity = item.quantity + delta;
              return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ cartItems: [] }),

      // Helpers
      getTotalItems: () => get().cartItems.reduce((acc, item) => acc + item.quantity, 0),
      getSubtotal: () => get().cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'piggy_cart', // unique name for localStorage
    }
  )
);
