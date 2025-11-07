import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ItemsTable from "./ItemsTable";
import ItemCard from "./ItemCard";
import Toolbar from "./Toolbar";
import ItemViewModal from "./ItemViewModal";
import ItemFormSheet from "./ItemFormSheet";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ImageLightboxModal from "./ImageLightboxModal";
import { handleExportCSV } from "./utils/handleExportCsv";
import { useItemStore } from "@/store/useItemStore";
import { useDeleteItem } from "@/api/admin/items/useDeleteItem";

export default function ProductsPage() {
  const {
    filteredItems = [],
    selectedItems = [],
    searchQuery,
    categoryFilter,
    availabilityFilter,
    discountFilter,
    sortBy,
    currentPage,
    itemsPerPage,
    isLoading,
    viewModalOpen,
    formSheetOpen,
    deleteDialogOpen,
    lightboxOpen,
    selectedItem,
    isMobile,
    categories = [],
    setCurrentPage,
    setViewModalOpen,
    setFormSheetOpen,
    setDeleteDialogOpen,
    setLightboxOpen,
    setSelectedItem,
    setIsMobile,
    setSortBy,
    handleViewItem,
    handleEditItem,
    handleAddItem,
    handleDeleteItem,
    handleSaveItem,
    handleBulkDelete,
    handleBulkToggleAvailability,
    handleSelectAll,
    handleSelectItem,
    applyFilters,
    getPaginatedItems,
    getTotalPages,
    resetData,
    items
  } = useItemStore();

  const { mutate, isPending } = useDeleteItem()

  const paginatedItems = getPaginatedItems();
  const totalPages = getTotalPages();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  // Debounced search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, categoryFilter, availabilityFilter, discountFilter, sortBy, items, applyFilters]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        document.querySelector('input[type="search"]')?.focus();
      } else if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleAddItem();
      } else if (e.key === 'Escape') {
        setViewModalOpen(false);
        setFormSheetOpen(false);
        setDeleteDialogOpen(false);
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleAddItem, setViewModalOpen, setFormSheetOpen, setDeleteDialogOpen, setLightboxOpen]);

  // Handle CSV Export
  const handleExport = () => {
    const dataToExport = selectedItems.length > 0
      ? items.filter(item => selectedItems.includes(item._id))
      : filteredItems;

    handleExportCSV(dataToExport);
    toast.success(`Exported ${dataToExport.length} items successfully`);
  };

  // Handle bulk delete confirmation
  const handleBulkDeleteConfirm = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Items</h1>
          <p className="text-muted-foreground mt-2">Manage your menu items and inventory</p>
        </div>

        {/* Toolbar */}
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={(value) => useItemStore.setState({ searchQuery: value })}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(value) => useItemStore.setState({ categoryFilter: value })}
          availabilityFilter={availabilityFilter}
          onAvailabilityFilterChange={(value) => useItemStore.setState({ availabilityFilter: value })}
          discountFilter={discountFilter}
          onDiscountFilterChange={(value) => useItemStore.setState({ discountFilter: value })}
          sortBy={sortBy}
          onSortChange={(value) => useItemStore.setState({ sortBy: value })}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => useItemStore.setState({ itemsPerPage: value })}
          onAddItem={handleAddItem}
          onExportCSV={handleExport}
          selectedCount={selectedItems.length}
          onBulkDelete={handleBulkDeleteConfirm}
          onBulkToggleAvailability={handleBulkToggleAvailability}
          onResetData={() => resetData({ categories: categories })}
          isMobile={isMobile}
          categories={categories}
        />

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-1/6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isMobile ? (
          <ItemCard
            items={paginatedItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onViewItem={handleViewItem}
            onEditItem={handleEditItem}
            onDeleteItem={(item) => {
              setSelectedItem(item);
              setDeleteDialogOpen(true);
            }}
          />
        ) : (
          <ItemsTable
            items={paginatedItems}
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onViewItem={handleViewItem}
            onEditItem={handleEditItem}
            onDeleteItem={(item) => {
              setSelectedItem(item);
              setDeleteDialogOpen(true);
            }}
          />
        )}

        {/* Pagination */}
        {filteredItems.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {endIndex} of {filteredItems.length} items
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground text-6xl mb-4">🍕</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || categoryFilter !== "all" || availabilityFilter !== "all" || discountFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first menu item"
                }
              </p>
              {!searchQuery && categoryFilter === "all" && availabilityFilter === "all" && discountFilter === "all" && (
                <Button onClick={handleAddItem} size="lg">
                  Add Item
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <div className="fixed bottom-6 right-6 z-40">
            <Button
              onClick={handleAddItem}
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg"
            >
              <span className="sr-only">Add Item</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
        )}

        {/* Modals */}
        <ItemViewModal
          item={selectedItem}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          onEdit={handleEditItem}
        />

        <ItemFormSheet
          item={selectedItem}
          open={formSheetOpen}
          onOpenChange={setFormSheetOpen}
          onSave={handleSaveItem}
          categories={categories}
        />

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => {
            if (selectedItem) {
              mutate(selectedItem._id, {
                onSuccess: () => {
                  handleDeleteItem(selectedItem._id);
                  toast.success("Item deleted successfully");
                },
                onError: () => {
                  toast.error("Something went wrong while deleting item!")
                }
              })
            }
          }}
          item={selectedItem}
          selectedCount={selectedItems.length}
        />

        <ImageLightboxModal
          item={selectedItem}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      </div>
    </div>
  );
}