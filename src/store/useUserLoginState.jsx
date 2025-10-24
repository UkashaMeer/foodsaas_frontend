import { create } from "zustand";

export const useUserLoginState = create((set) => {
  // Run once on store creation — before any render
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    isLogin: !!token, // directly initialize with token
    checkLogin: () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        set({ isLogin: !!token });
      }
    },
    removeLogin: () => {
      localStorage.removeItem("token");
      set({ isLogin: false });
    },
  };
});
