import { create } from "zustand";

export const useCartState = create((set) => ({
    showCart: false,
    openCart: () => {
        set({ showCart: true })
    },
    closeCart: () => {
        set({ showCart: false })
    },
    count: 0,
    setCount: (count) => {
        set({ count: count })
    }
}))