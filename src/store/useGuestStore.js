// stores/useGuestStore.js - Updated clear method
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Guest ID generation function
const generateGuestId = () => {
  return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

export const useGuestStore = create(
  persist(
    (set, get) => ({
      guestId: null,
      addresses: [],
      
      setGuestId: (guestId) => set({ guestId }),
      setAddresses: (addresses) => set({ addresses }),
      addAddress: (address) => set((state) => ({ 
        addresses: [...state.addresses, address] 
      })),
      
      clearGuestData: () => {
        if (typeof window === 'undefined') return
        
        console.log("🧹 Clearing guest data...")
        
        set({ 
          guestId: null, 
        })
        
        localStorage.removeItem('guestId')        
      },
      
      initializeGuestId: () => {
        if (typeof window === 'undefined') return
        
        const { guestId } = get()
        
        const userToken = localStorage.getItem('token') || getTokenFromCookie()
        if (userToken) {
          console.log("🚫 Skipping guest ID generation - user is logged in")
          return null
        }
        
        if (!guestId) {
          const newGuestId = generateGuestId()
          set({ guestId: newGuestId })
          
          localStorage.setItem('guestId', newGuestId)
          console.log("🎯 Generated new guestId:", newGuestId)
        }
        
        return get().guestId
      },
      
      initializeFromLocalStorage: () => {
        if (typeof window === 'undefined') return
        
        const userToken = localStorage.getItem('token') || getTokenFromCookie()
        const savedGuestId = localStorage.getItem('guestId')
        const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]')
        
      },
      
      syncToLocalStorage: () => {
        if (typeof window === 'undefined') return
        
        const { guestId, addresses } = get()
        
        if (guestId) {
          localStorage.setItem('guestId', guestId)
        }
        
        if (addresses.length > 0) {
          localStorage.setItem('userAddresses', JSON.stringify(addresses))
        }
        
      },
      
      hasGuestData: () => {
        const { guestId, addresses } = get()
        return !!guestId || addresses.length > 0
      }
    }),
    {
      name: 'guest-storage',
      partialize: (state) => ({ 
        guestId: state.guestId, 
        addresses: state.addresses 
      }),
      version: 1,
    }
  )
)

const getTokenFromCookie = () => {
  if (typeof window === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; token=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}