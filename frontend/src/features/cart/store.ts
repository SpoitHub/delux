import { create } from 'zustand';

interface CartState {
  itemsCount: number;
  setItemsCount: (count: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemsCount: 0,
  setItemsCount: (count) => set({ itemsCount: count }),
}));
