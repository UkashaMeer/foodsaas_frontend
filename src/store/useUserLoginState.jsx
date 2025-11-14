// stores/useUserLoginState.js - Updated
import { create } from "zustand";
import { getToken, decodeToken, removeToken, getTokenFromCookie, saveToken } from "@/utils/auth";
import { useGuestStore } from "./useGuestStore";

export const useUserLoginState = create((set, get) => {
  const token = getToken() || getTokenFromCookie();
  const userData = token ? decodeToken(token) : null;
  console.log(userData)

  return {
    isLogin: !!token,
    userRole: userData?.role || null,
    userData: userData,
    userId: userData?._id || null,
    userName: userData?.name || null,
    
    checkLogin: () => {
      const token = getToken() || getTokenFromCookie();
      if (token) {
        try {
          const userData = decodeToken(token);
          set({ 
            isLogin: true, 
            userRole: userData?.role,
            userData,
            userId: userData?._id,
            userName: userData?.name
          });
          
          const guestStore = useGuestStore.getState();
          guestStore.clearGuestData();
        } catch (error) {
          console.error('Token decode error in checkLogin:', error);
          removeToken();
          set({ 
            isLogin: false, 
            userRole: null,
            userData: null,
            userId: null,
            userName: null
          });
        }
      } else {
        set({ 
          isLogin: false, 
          userRole: null,
          userData: null,
          userId: null,
          userName: null
        });
      }
    },
    
    removeLogin: () => {
      removeToken();
      set({ 
        isLogin: false, 
        userRole: null,
        userData: null,
        userId: null,
        userName: null
      });
      
      const guestStore = useGuestStore.getState();
      guestStore.initializeGuestId();
    },

    setLogin: (token) => {
      saveToken(token);
      try {
        const userData = decodeToken(token);
        set({ 
          isLogin: true, 
          userRole: userData?.role,
          userData,
          userId: userData?._id,
          userName: userData?.name
        });
        
        const guestStore = useGuestStore.getState();
        guestStore.clearGuestData();
        
      } catch (error) {
        console.error('Token decode error in setLogin:', error);
        removeToken();
        set({ 
          isLogin: false, 
          userRole: null,
          userData: null,
          userId: null,
          userName: null
        });
      }
    },

    isOwner: () => get().userRole === 'OWNER',
    isRider: () => get().userRole === 'RIDER',
    isCustomer: () => get().userRole === 'CUSTOMER',
    
    // Update user data (useful when user updates their profile)
    updateUserData: (newData) => {
      set((state) => ({
        userData: { ...state.userData, ...newData },
        userName: newData.name || state.userName
      }));
    }
  };
});