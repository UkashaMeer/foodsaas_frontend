import { create } from 'zustand'

export const useRidersStore = create((set, get) => ({
  // State
  riders: [],
  filteredRiders: [],
  loading: false,
  searchQuery: '',
  filters: {
    isActive: 'all',
    vehicleType: 'all',
    verificationStatus: 'all',
    minOrdersCompleted: 0,
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
  },
  
  // Actions
  setRiders: (riders) => set({ riders, filteredRiders: riders }),
  
  setSearchQuery: (searchQuery) => {
    set({ searchQuery })
    get().applyFilters()
  },
  
  setFilters: (newFilters) => {
    set(state => ({ 
      filters: { ...state.filters, ...newFilters } 
    }))
    get().applyFilters()
  },
  
  setPagination: (pagination) => set({ pagination }),
  
  applyFilters: () => {
    const { riders, searchQuery, filters } = get()
    
    let filtered = riders.filter(rider => {
      // Search filter
      const matchesSearch = !searchQuery || 
        rider.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.userId.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.userId.phoneNumber.includes(searchQuery)
      
      // Status filter
      const matchesStatus = filters.isActive === 'all' || 
        rider.isActive === (filters.isActive === 'active')
      
      // Vehicle type filter
      const matchesVehicle = filters.vehicleType === 'all' || 
        rider.vehicleType === filters.vehicleType
      
      // Verification status filter
      const matchesVerification = filters.verificationStatus === 'all' || 
        rider.verificationStatus === filters.verificationStatus
      
      // Orders completed filter (you might need to adjust this based on your data structure)
      const ordersCompleted = rider.ordersCompletedToday?.length || 0
      const matchesOrders = ordersCompleted >= filters.minOrdersCompleted
      
      return matchesSearch && matchesStatus && matchesVehicle && 
             matchesVerification && matchesOrders
    })
    
    set({ filteredRiders: filtered })
  },
  
  getPaginatedRiders: () => {
    const { filteredRiders, pagination } = get()
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    
    return filteredRiders.slice(startIndex, endIndex)
  },
}))