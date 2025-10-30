import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useItemStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      categories: [],
      filteredItems: [],
      selectedItems: [],
      searchQuery: "",
      categoryFilter: "all",
      availabilityFilter: "all",
      discountFilter: "all",
      sortBy: "newest",
      currentPage: 1,
      itemsPerPage: 10,
      isLoading: false,
      viewModalOpen: false,
      formSheetOpen: false,
      deleteDialogOpen: false,
      lightboxOpen: false,
      selectedItem: null,
      isMobile: false,
      lastUsedFilters: {
        search: "",
        category: "all",
        availability: "all",
        discount: "all"
      },

      // Initialize with data
      initializeData: (data) => {
        if (!data || !data.categories) return;

        const categories = data.categories;
        // Flatten all items from categories and add categoryName
        const allItems = categories.flatMap(category =>
          category.items.map(item => ({
            ...item,
            categoryName: category.name,
            categoryId: category._id,
            createdAt: item.createdAt || item._id ?
              (item._id.toString().length === 24 ?
                new Date(parseInt(item._id.toString().substring(0, 8), 16) * 1000).toISOString() :
                new Date().toISOString()
              ) :
              new Date().toISOString()
          }))
        );

        set({
          categories,
          items: allItems,
          filteredItems: allItems
        });
      },

      // Setters
      setSortBy: (sortBy) => set({ sortBy }),
      setItems: (items) => set({ items }),
      setCategories: (categories) => set({ categories }),
      setFilteredItems: (filteredItems) => set({ filteredItems }),
      setSelectedItems: (selectedItems) => set({ selectedItems }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
      setAvailabilityFilter: (availabilityFilter) => set({ availabilityFilter }),
      setDiscountFilter: (discountFilter) => set({ discountFilter }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setViewModalOpen: (viewModalOpen) => set({ viewModalOpen }),
      setFormSheetOpen: (formSheetOpen) => set({ formSheetOpen }),
      setDeleteDialogOpen: (deleteDialogOpen) => set({ deleteDialogOpen }),
      setLightboxOpen: (lightboxOpen) => set({ lightboxOpen }),
      setSelectedItem: (selectedItem) => set({ selectedItem }),
      setIsMobile: (isMobile) => set({ isMobile }),

      // Save filters to localStorage
      saveFilters: () => {
        const { searchQuery, categoryFilter, availabilityFilter, discountFilter } = get();
        set({
          lastUsedFilters: {
            search: searchQuery,
            category: categoryFilter,
            availability: availabilityFilter,
            discount: discountFilter,
            sortBy: sortBy
          }
        });
      },

      // Load saved filters
      loadSavedFilters: () => {
        const { lastUsedFilters } = get();
        set({
          searchQuery: lastUsedFilters.search,
          categoryFilter: lastUsedFilters.category,
          availabilityFilter: lastUsedFilters.availability,
          discountFilter: lastUsedFilters.discount,
          sortBy: lastUsedFilters.sortBy
        });
      },

      // Reset to initial data
      resetData: (initialData) => {
        get().initializeData(initialData);
        set({
          selectedItems: [],
          searchQuery: "",
          categoryFilter: "all",
          availabilityFilter: "all",
          discountFilter: "all",
          currentPage: 1
        });
      },

      // Item Actions
      handleViewItem: (item) => {
        set({ selectedItem: item, viewModalOpen: true });
      },

      handleEditItem: (item) => {
        set({ selectedItem: item, formSheetOpen: true });
      },

      handleAddItem: () => {
        set({ selectedItem: null, formSheetOpen: true });
      },

      handleDeleteItem: (itemId) => {
        const { items, selectedItems, filteredItems } = get();
        const updatedItems = items.filter(item => item._id !== itemId);

        set({
          items: updatedItems,
          filteredItems: filteredItems.filter(item => item._id !== itemId),
          selectedItems: selectedItems.filter(id => id !== itemId),
          deleteDialogOpen: false,
          selectedItem: null
        });
      },

      handleSaveItem: (itemData, isEdit = false) => {
        const { items, selectedItem, categories } = get();

        if (isEdit && selectedItem) {
          // Edit existing item
          const updatedItems = items.map(item =>
            item._id === selectedItem._id ? { ...item, ...itemData } : item
          );

          set({
            items: updatedItems,
            filteredItems: updatedItems,
            selectedItem: null
          });
        } else {
          // Add new item
          const newItem = {
            ...itemData,
            _id: `item-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const updatedItems = [newItem, ...items];
          set({
            items: updatedItems,
            filteredItems: updatedItems,
            selectedItem: null
          });
        }
        set({ formSheetOpen: false });
      },

      // Bulk Actions
      handleBulkDelete: () => {
        const { items, selectedItems, filteredItems } = get();
        const updatedItems = items.filter(item => !selectedItems.includes(item._id));

        set({
          items: updatedItems,
          filteredItems: updatedItems,
          selectedItems: [],
          deleteDialogOpen: false
        });
      },

      handleBulkToggleAvailability: () => {
        const { items, selectedItems, filteredItems } = get();
        const updatedItems = items.map(item =>
          selectedItems.includes(item._id) ? { ...item, isAvailable: !item.isAvailable } : item
        );

        set({
          items: updatedItems,
          filteredItems: updatedItems,
          selectedItems: []
        });
      },

      // Selection
      handleSelectAll: (checked) => {
        const { getPaginatedItems } = get();
        const paginatedItems = getPaginatedItems();
        set({
          selectedItems: checked
            ? paginatedItems.map(item => item._id)
            : []
        });
      },

      handleSelectItem: (itemId, checked) => {
        const { selectedItems } = get();
        set({
          selectedItems: checked
            ? [...selectedItems, itemId]
            : selectedItems.filter(id => id !== itemId)
        });
      },

      // Filtering and Search
      applyFilters: () => {
        const { items, searchQuery, categoryFilter, availabilityFilter, discountFilter, sortBy } = get();

        let results = items;

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          results = results.filter(item =>
            item.name?.toLowerCase().includes(query) ||
            item.details?.toLowerCase().includes(query) ||
            item.categoryName?.toLowerCase().includes(query)
          );
        }

        // Apply category filter
        if (categoryFilter !== "all") {
          results = results.filter(item => item.categoryId === categoryFilter);
        }

        // Apply availability filter
        if (availabilityFilter !== "all") {
          results = results.filter(item =>
            availabilityFilter === "available" ? item.isAvailable : !item.isAvailable
          );
        }

        // Apply discount filter
        if (discountFilter !== "all") {
          results = results.filter(item => item.isOnDiscount);
        }

        results = get().applySorting(results, sortBy);

        set({ filteredItems: results, currentPage: 1 });
        get().saveFilters();
      },

      applySorting: (items, sortType) => {
        const sortedItems = [...items];

        switch (sortType) {
          case "newest":
            return sortedItems.sort((a, b) => {
              const dateA = new Date(a.createdAt || a._id || 0);
              const dateB = new Date(b.createdAt || b._id || 0);
              return dateB - dateA;
            });
          case "oldest":
            return sortedItems.sort((a, b) => {
              const dateA = new Date(a.createdAt || a._id || 0);
              const dateB = new Date(b.createdAt || b._id || 0);
              return dateA - dateB;
            });
          case "name_asc":
            return sortedItems.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          case "name_desc":
            return sortedItems.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
          case "price_low":
            return sortedItems.sort((a, b) => (a.price || 0) - (b.price || 0));
          case "price_high":
            return sortedItems.sort((a, b) => (b.price || 0) - (a.price || 0));
          default:
            return sortedItems;
        }
      },
      // Pagination
      getPaginatedItems: () => {
        const { filteredItems, currentPage, itemsPerPage } = get();
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(startIndex, startIndex + itemsPerPage);
      },

      getTotalPages: () => {
        const { filteredItems, itemsPerPage } = get();
        return Math.ceil(filteredItems.length / itemsPerPage);
      },

      // Quick actions
      toggleItemAvailability: (itemId) => {
        const { items, filteredItems } = get();
        const updatedItems = items.map(item =>
          item._id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
        );

        set({
          items: updatedItems,
          filteredItems: updatedItems
        });
      },

      toggleItemDiscount: (itemId) => {
        const { items, filteredItems } = get();
        const updatedItems = items.map(item =>
          item._id === itemId ? { ...item, isOnDiscount: !item.isOnDiscount } : item
        );

        set({
          items: updatedItems,
          filteredItems: updatedItems
        });
      }

    }),
    {
      name: 'item-storage',
      partialize: (state) => ({
        items: state.items,
        categories: state.categories,
        lastUsedFilters: state.lastUsedFilters
      })
    }
  )
);