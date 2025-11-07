import { create } from 'zustand';

export const useTransactionStore = create((set, get) => ({
  // State
  filters: {
    status: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    search: '',
    page: 1,
    limit: 10,
  },
  selectedTransaction: null,
  isViewModalOpen: false,

  // Actions
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({
    filters: {
      status: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      search: '',
      page: 1,
      limit: 10,
    }
  }),

  setSelectedTransaction: (transaction) => set({ 
    selectedTransaction: transaction 
  }),

  setIsViewModalOpen: (isOpen) => set({ 
    isViewModalOpen: isOpen 
  }),

  getQueryParams: () => {
    const { filters } = get();
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    return params.toString();
  },

  // Pagination actions
  nextPage: () => set((state) => ({
    filters: { ...state.filters, page: state.filters.page + 1 }
  })),

  prevPage: () => set((state) => ({
    filters: { ...state.filters, page: Math.max(1, state.filters.page - 1) }
  })),

  goToPage: (page) => set((state) => ({
    filters: { ...state.filters, page }
  })),
}));