// stores/useAddressStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAddressStore = create(
  persist(
    (set, get) => ({
      // State
      addresses: [],
      selectedAddress: null,
      isAddressPopupOpen: false,
      
      // Map related states
      mapLocation: null,
      mapAddress: '',
      mapSuggestions: [],
      isMapLoading: false,
      isLocating: false,

      // Actions
      setAddresses: (addresses) => set({ addresses }),
      
      setSelectedAddress: (address) => {
        set({ selectedAddress: address })
        // Also save to localStorage for quick access
        if (address) {
          localStorage.setItem('userAddress', JSON.stringify(address))
        }
      },

      setAddressPopupOpen: (isOpen) => set({ isAddressPopupOpen: isOpen }),

      // Map Actions
      setMapLocation: (location) => set({ mapLocation: location }),
      setMapAddress: (address) => set({ mapAddress: address }),
      setMapSuggestions: (suggestions) => set({ mapSuggestions: suggestions }),
      setMapLoading: (isLoading) => set({ isMapLoading: isLoading }),
      setLocating: (isLocating) => set({ isLocating }),

      // Address Management
      addAddress: (newAddress) => {
        const { addresses } = get()
        
        // If this is default, remove default from others
        let updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: newAddress.isDefault ? false : addr.isDefault
        }))

        updatedAddresses.push(newAddress)
        
        set({ 
          addresses: updatedAddresses,
          selectedAddress: newAddress
        })

        // Save to localStorage
        localStorage.setItem('userAddress', JSON.stringify(newAddress))
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses))
      },

      updateAddress: (addressId, updatedAddress) => {
        const { addresses, selectedAddress } = get()
        
        const updatedAddresses = addresses.map(addr =>
          addr._id === addressId ? { ...addr, ...updatedAddress } : addr
        )

        set({ addresses: updatedAddresses })
        
        // Update selected address if it was updated
        if (selectedAddress && selectedAddress._id === addressId) {
          set({ selectedAddress: { ...selectedAddress, ...updatedAddress } })
          localStorage.setItem('userAddress', JSON.stringify({ ...selectedAddress, ...updatedAddress }))
        }

        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses))
      },

      deleteAddress: (addressId) => {
        const { addresses, selectedAddress } = get()
        
        const updatedAddresses = addresses.filter(addr => addr._id !== addressId)
        
        set({ addresses: updatedAddresses })
        
        // If deleted address was selected, select another one or clear
        if (selectedAddress && selectedAddress._id === addressId) {
          const newSelected = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0] || null
          set({ selectedAddress: newSelected })
          
          if (newSelected) {
            localStorage.setItem('userAddress', JSON.stringify(newSelected))
          } else {
            localStorage.removeItem('userAddress')
          }
        }

        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses))
      },

      setDefaultAddress: (addressId) => {
        const { addresses } = get()
        
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId
        }))

        const newDefault = updatedAddresses.find(addr => addr._id === addressId)
        
        set({ 
          addresses: updatedAddresses,
          selectedAddress: newDefault
        })

        localStorage.setItem('userAddress', JSON.stringify(newDefault))
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses))
      },

      // Initialize from localStorage
      initializeFromStorage: () => {
        const storedAddress = localStorage.getItem('userAddress')
        const storedAddresses = localStorage.getItem('userAddresses')
        
        if (storedAddress) {
          try {
            const address = JSON.parse(storedAddress)
            set({ selectedAddress: address })
          } catch (error) {
            console.error('Error parsing stored address:', error)
          }
        }

        if (storedAddresses) {
          try {
            const addresses = JSON.parse(storedAddresses)
            set({ addresses })
          } catch (error) {
            console.error('Error parsing stored addresses:', error)
          }
        }
      },

      // Clear all addresses (logout)
      clearAddresses: () => {
        set({
          addresses: [],
          selectedAddress: null,
          isAddressPopupOpen: false,
          mapLocation: null,
          mapAddress: '',
          mapSuggestions: []
        })
        localStorage.removeItem('userAddress')
        localStorage.removeItem('userAddresses')
      },

      // Check if user has addresses
      hasAddresses: () => {
        const { addresses } = get()
        return addresses.length > 0
      },

      // Get default address
      getDefaultAddress: () => {
        const { addresses } = get()
        return addresses.find(addr => addr.isDefault) || addresses[0] || null
      }

    }),
    {
      name: 'address-storage',
      // We'll handle persistence manually for addresses
      partialize: (state) => ({
        addresses: state.addresses,
        selectedAddress: state.selectedAddress
      })
    }
  )
)