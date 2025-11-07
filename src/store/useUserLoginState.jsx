import { create } from "zustand";
import { getToken, decodeToken, removeToken, getTokenFromCookie } from "@/utils/auth";

export const useUserLoginState = create((set) => {
  const token = getToken() || getTokenFromCookie();

  return {
    isLogin: !!token,
    userRole: token ? decodeToken(token)?.role : null,
    userData: token ? decodeToken(token) : null,
    
    checkLogin: () => {
      const token = getToken() || getTokenFromCookie();
      if (token) {
        const userData = decodeToken(token);
        set({ 
          isLogin: true, 
          userRole: userData?.role,
          userData 
        });
      } else {
        set({ 
          isLogin: false, 
          userRole: null,
          userData: null 
        });
      }
    },
    
    removeLogin: () => {
      removeToken();
      set({ 
        isLogin: false, 
        userRole: null,
        userData: null 
      });
    },

    setLogin: (token) => {
      saveToken(token);
      const userData = decodeToken(token);
      set({ 
        isLogin: true, 
        userRole: userData?.role,
        userData 
      });
    }
  };
});