"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CategoriesTable from "./CategoriesTable";
import CategoryCard from "./CategoryCard";
import Toolbar from "./Toolbar";
import CategoryViewModal from "./CategoryViewModal";
import CategoryFormSheet from "./CategoryFormSheet";
import { handleExportCSV } from "./utils/handleExportCsv";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useDeleteCategory } from "@/api/admin/category/useDeleteCategory";

export const CategoriesPage = ({ categoriesData }) => {
  const { mutate: deleteCategoryMutate, isPending: isPendingDeleteCategory } = useDeleteCategory();
  
  // Zustand store se state aur actions le rahe hain
  const {
    categories,
    filteredCategories,
    selectedCategories,
    searchQuery,
    statusFilter,
    currentPage,
    isLoading,
    viewModalOpen,
    formSheetOpen,
    selectedCategory,
    isMobile,
    setCategories,
    setFilteredCategories,
    setSearchQuery,
    setStatusFilter,
    setCurrentPage,
    setIsLoading,
    setViewModalOpen,
    setFormSheetOpen,
    setSelectedCategory,
    setIsMobile,
    handleViewCategory,
    handleEditCategory,
    handleAddCategory,
    handleDeleteCategory,
    handleSaveCategory,
    handleBulkDelete,
    handleBulkToggle,
    handleSelectAll,
    handleSelectCategory,
    applyFilters,
    getPaginatedCategories,
    getTotalPages
  } = useCategoryStore();

  const itemsPerPage = 10;
  
  // Current page ke liye categories nikalne ke liye
  const paginatedCategories = getPaginatedCategories();
  const totalPages = getTotalPages();
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Initial data load - IMPORTANT: yeh sirf ek baar hona chahiye
  useEffect(() => {
    if (categoriesData && categories.length === 0) {
      console.log("Setting categories data:", categoriesData);
      setCategories(categoriesData);
    }
  }, [categoriesData, setCategories, categories.length]);

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
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      applyFilters();
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, categories, applyFilters, setIsLoading]);

  // Delete category with API call
  const handleDeleteWithAPI = (categoryId) => {
    if (categoryId) {
      deleteCategoryMutate(categoryId, {
        onSuccess: (res) => {
          handleDeleteCategory(categoryId);
          toast.success("Category deleted successfully.");
        },
        onError: (err) => {
          toast.error("Something went wrong while deleting category.");
        }
      });
    }
  };

  // Debugging ke liye
  useEffect(() => {
    console.log("Current State:", {
      categoriesCount: categories.length,
      filteredCount: filteredCategories.length,
      paginatedCount: paginatedCategories.length,
      currentPage,
      totalPages
    });
  }, [categories, filteredCategories, paginatedCategories, currentPage, totalPages]);

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg md:text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-2">Manage your product categories</p>
        </div>

        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddCategory={handleAddCategory}
          onExportCSV={() => handleExportCSV(filteredCategories)}
          selectedCount={selectedCategories.length}
          onBulkDelete={handleBulkDelete}
          onBulkToggle={handleBulkToggle}
          isMobile={isMobile}
        />

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isMobile && filteredCategories.length > 0 ? (
          <CategoryCard
            categories={paginatedCategories}
            selectedCategories={selectedCategories}
            onSelectCategory={handleSelectCategory}
            onViewCategory={handleViewCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteWithAPI}
          />
        ) : filteredCategories.length > 0 ? (
          <CategoriesTable
            categories={paginatedCategories}
            selectedCategories={selectedCategories}
            onSelectAll={handleSelectAll}
            onSelectCategory={handleSelectCategory}
            onViewCategory={handleViewCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteWithAPI}
          />
        ) : null}

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCategories.length)} of{" "}
              {filteredCategories.length} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground text-6xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first category"
                }
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={handleAddCategory}>
                  Add Category
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <CategoryViewModal
          category={selectedCategory}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
        />

        <CategoryFormSheet
          category={selectedCategory}
          open={formSheetOpen}
          onOpenChange={setFormSheetOpen}
          onSave={handleSaveCategory}
        />
      </div>
    </div>
  );
};