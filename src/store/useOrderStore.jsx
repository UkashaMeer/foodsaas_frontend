// store/useOrderStore.js
import { create } from 'zustand'

const useOrderStore = create((set, get) => ({
  // State
  orders: [],
  filteredOrders: [],
  selectedOrder: null,
  filters: {
    status: [],
    paymentStatus: [],
    paymentMethod: [],
    city: [],
    dateRange: { from: null, to: null },
  },
  sort: {
    field: 'orderedAt',
    direction: 'desc',
  },
  searchQuery: '',
  isLoading: true,
  isModalOpen: false,
  isStatusDialogOpen: false,
  isRiderDialogOpen: false,

  // Actions
  setOrders: (orders) => {
    const state = get()
    const filtered = applyFiltersAndSort(orders, state.filters, state.sort, state.searchQuery)
    set({ orders, filteredOrders: filtered })
  },

  setSelectedOrder: (order) => set({ selectedOrder: order }),

  setFilters: (filters) => {
    const state = get()
    const filtered = applyFiltersAndSort(state.orders, filters, state.sort, state.searchQuery)
    set({ filters, filteredOrders: filtered })
  },

  // New action for updating order status locally
  updateOrderStatus: (orderId, newStatus) => {
    const state = get()

    // Update in orders array
    const updatedOrders = state.orders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    )

    // Update in filteredOrders array
    const updatedFilteredOrders = state.filteredOrders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    )

    // Update selectedOrder if it's currently open
    const updatedSelectedOrder = state.selectedOrder && state.selectedOrder._id === orderId
      ? { ...state.selectedOrder, status: newStatus }
      : state.selectedOrder

    set({
      orders: updatedOrders,
      filteredOrders: updatedFilteredOrders,
      selectedOrder: updatedSelectedOrder
    })
  },

  setSort: (sort) => {
    const state = get()
    const filtered = applyFiltersAndSort(state.orders, state.filters, sort, state.searchQuery)
    set({ sort, filteredOrders: filtered })
  },

  setSearchQuery: (query) => {
    const state = get()
    const filtered = applyFiltersAndSort(state.orders, state.filters, state.sort, query)
    set({ searchQuery: query, filteredOrders: filtered })
  },

  setLoading: (isLoading) => set({ isLoading }),

  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setStatusDialogOpen: (isOpen) => set({ isStatusDialogOpen: isOpen }),
  setRiderDialogOpen: (isOpen) => set({ isRiderDialogOpen: isOpen }),

  clearFilters: () => {
    const state = get()
    set({
      filters: {
        status: [],
        paymentStatus: [],
        paymentMethod: [],
        city: [],
        dateRange: { from: null, to: null },
      },
      filteredOrders: state.orders
    })
  },
}))

// Helper function
const applyFiltersAndSort = (orders, filters, sort, searchQuery) => {
  let filtered = [...orders]

  // Apply search
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(query) ||
      order.fullName.toLowerCase().includes(query) ||
      order.phoneNumber.toString().includes(query) ||
      order.email.toLowerCase().includes(query) ||
      order.city.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (filters.status.length > 0) {
    filtered = filtered.filter(order => filters.status.includes(order.status))
  }

  // Apply payment status filter
  if (filters.paymentStatus.length > 0) {
    filtered = filtered.filter(order => filters.paymentStatus.includes(order.paymentStatus))
  }

  // Apply payment method filter
  if (filters.paymentMethod.length > 0) {
    filtered = filtered.filter(order => filters.paymentMethod.includes(order.paymentMethod))
  }

  // Apply city filter
  if (filters.city.length > 0) {
    filtered = filtered.filter(order => filters.city.includes(order.city))
  }

  // Apply date range filter
  if (filters.dateRange.from && filters.dateRange.to) {
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.orderedAt)
      return orderDate >= filters.dateRange.from && orderDate <= filters.dateRange.to
    })
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[sort.field]
    let bValue = b[sort.field]

    if (sort.field === 'orderedAt' || sort.field === 'createdAt') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (sort.field === 'totalPrice') {
      aValue = Number(aValue)
      bValue = Number(bValue)
    }

    if (sort.direction === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
}

export default useOrderStore