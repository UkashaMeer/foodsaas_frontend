import { create } from "zustand";

export const useAuthDialogState = create((set) => ({
    showRegister: true,
    showOTP: false,
    showLogin: false,
    openLogin: () => set({ showLogin: true }),
    closeLogin: () => set({ showLogin: false }),
    openRegister: () => set({ showRegister: true }),
    closeRegister: () => set({ showRegister: false }),
    openOTP: () => set({ showOTP: true }),
    closeOTP: () => set({ showOTP: false }),
    checkAuth: () => {
        const token = typeof window !== "undefined" && localStorage.getItem("token")
        if (token) {
            set({ showOTP: false, showRegister: false })
        }
    }
}))