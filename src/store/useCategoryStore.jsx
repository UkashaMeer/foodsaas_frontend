import { create } from 'zustand';

export const useCategoryStore = create((set, get) => ({
  // State
  categories: [],
  filteredCategories: [],
  selectedCategories: [],
  searchQuery: "",
  statusFilter: "all",
  currentPage: 1,
  isLoading: false,
  viewModalOpen: false,
  formSheetOpen: false,
  selectedCategory: null,
  isMobile: false,

  // Items per page
  itemsPerPage: 10,

  // Actions
  setCategories: (categories) => set({
    categories,
    filteredCategories: categories // Initial filtered categories bhi set karein
  }),

  setFilteredCategories: (filteredCategories) => set({ filteredCategories }),

  setSelectedCategories: (selectedCategories) => set({ selectedCategories }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setStatusFilter: (statusFilter) => set({ statusFilter }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setViewModalOpen: (viewModalOpen) => set({ viewModalOpen }),

  setFormSheetOpen: (formSheetOpen) => set({ formSheetOpen }),

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  setIsMobile: (isMobile) => set({ isMobile }),

  // Category Actions
  handleViewCategory: (category) => {
    set({ selectedCategory: category, viewModalOpen: true });
  },

  handleEditCategory: (category) => {
    set({ selectedCategory: category, formSheetOpen: true });
  },

  handleAddCategory: () => {
    set({ selectedCategory: null, formSheetOpen: true });
  },

  handleDeleteCategory: (categoryId) => {
    const { categories, selectedCategories, filteredCategories } = get();
    const updatedCategories = categories.filter(cat => cat._id !== categoryId);

    set({
      categories: updatedCategories,
      filteredCategories: filteredCategories.filter(cat => cat._id !== categoryId),
      selectedCategories: selectedCategories.filter(id => id !== categoryId)
    });
  },

  handleSaveCategory: (categoryData, isEdit = false) => {
    const { categories, selectedCategory } = get();

    console.log("Saving category:", { categoryData, isEdit, selectedCategory });

    if (isEdit && selectedCategory) {
      // Edit existing category
      const updatedCategories = categories.map(cat =>
        cat._id === selectedCategory._id ? { ...cat, ...categoryData } : cat
      );

      set({
        categories: updatedCategories,
        filteredCategories: updatedCategories,
        selectedCategory: null
      });
    } else {
      // Add new category
      const newCategory = {
        ...categoryData,
        _id: categoryData._id || Date.now().toString(), // Use API response ID if available
        createdAt: categoryData.createdAt || new Date().toISOString(),
        updatedAt: categoryData.updatedAt || new Date().toISOString(),
      };

      set({
        categories: [newCategory, ...categories],
        filteredCategories: [newCategory, ...categories],
        selectedCategory: null
      });
    }
    set({ formSheetOpen: false });
  },

  // Bulk Actions
  handleBulkDelete: () => {
    const { categories, selectedCategories, filteredCategories } = get();
    const updatedCategories = categories.filter(cat => !selectedCategories.includes(cat._id));

    set({
      categories: updatedCategories,
      filteredCategories: updatedCategories,
      selectedCategories: []
    });
  },

  handleBulkToggle: () => {
    const { categories, selectedCategories, filteredCategories } = get();
    const updatedCategories = categories.map(cat =>
      selectedCategories.includes(cat._id) ? { ...cat, isActive: !cat.isActive } : cat
    );

    set({
      categories: updatedCategories,
      filteredCategories: updatedCategories
    });
  },

  handleSelectAll: (checked) => {
    const { getPaginatedCategories } = get();
    const paginatedCategories = getPaginatedCategories();
    set({
      selectedCategories: checked
        ? paginatedCategories.map(cat => cat._id)
        : []
    });
  },

  handleSelectCategory: (categoryId, checked) => {
    const { selectedCategories } = get();
    set({
      selectedCategories: checked
        ? [...selectedCategories, categoryId]
        : selectedCategories.filter(id => id !== categoryId)
    });
  },

  // Filter categories based on search and status
  applyFilters: () => {
    const { categories, searchQuery, statusFilter } = get();

    let results = categories;

    // Apply search filter
    if (searchQuery) {
      results = results.filter(category =>
        category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(category =>
        statusFilter === "active" ? category.isActive : !category.isActive
      );
    }

    set({ filteredCategories: results, currentPage: 1 });
  },

  // Get paginated categories - Simple function bana dein
  getPaginatedCategories: () => {
    const { filteredCategories, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  },

  // Get total pages - Simple function bana dein
  getTotalPages: () => {
    const { filteredCategories, itemsPerPage } = get();
    return Math.ceil(filteredCategories.length / itemsPerPage);
  }
}));