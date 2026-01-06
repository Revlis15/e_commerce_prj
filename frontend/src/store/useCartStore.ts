import { create } from 'zustand';
import { Cart } from '../types';

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),
  itemCount: () => {
    const cart = get().cart;
    return cart?.chiTiets?.reduce((sum, item) => sum + item.soLuong, 0) || 0;
  },
}));
