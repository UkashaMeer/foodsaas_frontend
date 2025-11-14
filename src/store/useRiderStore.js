// store/useRiderStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useRiderStore = create(
  persist(
    (set, get) => ({
      // State
      rider: null,
      riderId: null, // ✅ Add riderId in store
      dashboardStats: null,
      availableOrders: [],
      assignedOrders: [],
      ordersCompletedToday: [],
      orderHistory: [],
      currentPeriod: 'today',
      onlineStatus: 'OFFLINE',
      workTimer: 0,
      timerInterval: null,
      
      // Actions
      setRider: (rider) => set({ 
        rider,
        riderId: rider?._id || null, // ✅ Set riderId automatically
        onlineStatus: rider?.status || 'OFFLINE',
      }),
      
      // ✅ Add setRiderId action
      setRiderId: (riderId) => set({ riderId }),
      
      setDashboardStats: (stats) => set({ dashboardStats: stats }),
      setAssignedOrders: (orders) => set({ assignedOrders: orders }),
      setAvailableOrders: (orders) => set({ availableOrders: orders }),
      setOrdersCompletedToday: (orders) => set({ ordersCompletedToday: orders }),
      setOrderHistory: (history) => set({ orderHistory: history }),
      setCurrentPeriod: (period) => set({ currentPeriod: period }),
      setOnlineStatus: (status) => set({ onlineStatus: status }),
      
      // Timer functions
      startTimer: () => {
        const { timerInterval } = get()
        if (timerInterval) {
          clearInterval(timerInterval)
        }
        const interval = setInterval(() => {
          set((state) => ({ workTimer: state.workTimer + 1 }))
        }, 1000)
        set({ timerInterval: interval })
      },
      
      stopTimer: () => {
        const { timerInterval } = get()
        if (timerInterval) {
          clearInterval(timerInterval)
          set({ timerInterval: null })
        }
      },
      
      resetTimer: () => set({ workTimer: 0 }),
      
      // Format timer for display
      formatTimer: () => {
        const { workTimer } = get()
        const hours = Math.floor(workTimer / 3600)
        const minutes = Math.floor((workTimer % 3600) / 60)
        const seconds = workTimer % 60
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      },

      // Clear all data (logout ke liye)
      clearStore: () => set({
        rider: null,
        riderId: null, // ✅ Clear riderId too
        dashboardStats: null,
        availableOrders: [],
        assignedOrders: [],
        ordersCompletedToday: [],
        orderHistory: [],
        onlineStatus: 'OFFLINE',
        workTimer: 0,
        timerInterval: null,
      })
    }),
    {
      name: 'rider-storage',
      partialize: (state) => ({
        rider: state.rider,
        riderId: state.riderId, // ✅ Persist riderId
        dashboardStats: state.dashboardStats,
        availableOrders: state.availableOrders,
        assignedOrders: state.assignedOrders,
        ordersCompletedToday: state.ordersCompletedToday,
        orderHistory: state.orderHistory,
        currentPeriod: state.currentPeriod,
        onlineStatus: state.onlineStatus,
        workTimer: state.workTimer,
      })
    }
  )
)