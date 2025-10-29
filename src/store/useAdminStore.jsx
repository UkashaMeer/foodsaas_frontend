import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create(
  persist(
    (set, get) => ({
      // ===== Initial State =====
      sidebarCollapsed: false,
      activeMenuItem: "dashboard",
      mobileSidebarOpen: false,
      notificationsOpen: false,
      profileDropdownOpen: false,
      searchOpen: false,

      // ===== Actions =====
      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setActiveMenuItem: (item) =>
        set({
          activeMenuItem: item,
          mobileSidebarOpen: false, // Close mobile sidebar on selection
        }),

      toggleMobileSidebar: () =>
        set((state) => ({
          mobileSidebarOpen: !state.mobileSidebarOpen,
        })),

      setNotificationsOpen: (open) =>
        set({
          notificationsOpen: open,
          profileDropdownOpen: false,
        }),

      setProfileDropdownOpen: (open) =>
        set({
          profileDropdownOpen: open,
          notificationsOpen: false,
        }),

      setSearchOpen: (open) => set({ searchOpen: open }),

      closeAllDropdowns: () =>
        set({
          notificationsOpen: false,
          profileDropdownOpen: false,
          searchOpen: false,
        }),
    }),
    {
      name: "admin-storage", // key for localStorage
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        activeMenuItem: state.activeMenuItem,
      }),
    }
  )
);
