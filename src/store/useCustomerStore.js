import { create } from 'zustand'

export const useCustomerStore = create((set, get) => ({
  // State
  customers: [],
  searchTerm: '',
  statusFilter: 'all',
  selectedCustomer: null,
  viewModalOpen: false,
  editModalOpen: false,
  deleteModalOpen: false,
  currentPage: 1,
  itemsPerPage: 10,

  // Actions
  setCustomers: (customers) => set({ customers }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setViewModalOpen: (open) => set({ viewModalOpen: open }),
  setEditModalOpen: (open) => set({ editModalOpen: open }),
  setDeleteModalOpen: (open) => set({ deleteModalOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),

  // Computed values
  filteredCustomers: () => {
    const { customers, searchTerm, statusFilter } = get()
    
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phoneNumber.includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter.toUpperCase()
      
      return matchesSearch && matchesStatus
    })
  },

  paginatedCustomers: () => {
    const { filteredCustomers, currentPage, itemsPerPage } = get()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredCustomers().slice(startIndex, endIndex)
  },

  totalPages: () => {
    const { filteredCustomers, itemsPerPage } = get()
    return Math.ceil(filteredCustomers().length / itemsPerPage)
  },

  // Modal handlers
  openViewModal: (customer) => {
    set({ selectedCustomer: customer, viewModalOpen: true })
  },

  openEditModal: (customer) => {
    set({ selectedCustomer: customer, editModalOpen: true })
  },

  openDeleteModal: (customer) => {
    set({ selectedCustomer: customer, deleteModalOpen: true })
  }
}))