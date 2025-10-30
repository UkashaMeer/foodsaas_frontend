import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpDown, Calendar, ArrowUp, ArrowDown } from "lucide-react";

export default function Toolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  discountFilter,
  onDiscountFilterChange,
  sortBy = "Newest First",
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  onAddItem,
  onExportCSV,
  selectedCount,
  onBulkDelete,
  onBulkToggleAvailability,
  onResetData,
  isMobile,
  categories
}) {
  const fileInputRef = useRef(null);
  const [showCategoryChips, setShowCategoryChips] = useState(false);

  // Get sort label for display
  const getSortLabel = (value) => {
    switch(value) {
      case "newest": return "Newest First";
      case "oldest": return "Oldest First";
      case "name_asc": return "Name A-Z";
      case "name_desc": return "Name Z-A";
      case "price_low": return "Price: Low to High";
      case "price_high": return "Price: High to Low";
      default: return "Newest First";
    }
  };

  // Quick filters - UPDATED
  const quickFilters = [
    { label: "All", value: { category: "all", availability: "all", discount: "all", sort: "newest" } },
    { label: "Available", value: { category: "all", availability: "available", discount: "all", sort: "newest" } },
    { label: "On Discount", value: { category: "all", availability: "all", discount: "discount", sort: "newest" } },
    { label: "Latest", value: { category: "all", availability: "all", discount: "all", sort: "newest" } },
    { label: "Oldest", value: { category: "all", availability: "all", discount: "all", sort: "oldest" } },
  ];

  const applyQuickFilter = (filter) => {
    onCategoryFilterChange(filter.category);
    onAvailabilityFilterChange(filter.availability);
    onDiscountFilterChange(filter.discount);
    onSortChange(filter.sort);
  };

  const isActiveFilter = (filter) => {
    return categoryFilter === filter.category && 
           availabilityFilter === filter.availability && 
           discountFilter === filter.discount &&
           sortBy === filter.sort;
  };

  return (
    <Card className="mb-6 py-0!">
      <CardContent className="p-4">
        {/* Search and Main Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-full">
            <Input
              type="search"
              placeholder="Search items by name, details, or category..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onExportCSV}>
              Export CSV
            </Button>
            <Button onClick={onAddItem}>
              Add Item
            </Button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Availability Filter */}
          <Select value={availabilityFilter} onValueChange={onAvailabilityFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          {/* Discount Filter */}
          <Select value={discountFilter} onValueChange={onDiscountFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Discount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="discount">On Discount</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-48">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>{getSortLabel(sortBy)}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name_asc">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Items Per Page */}
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(parseInt(value))}>
            <SelectTrigger className="w-full sm:w-24">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button variant="outline" onClick={onResetData}>
            Reset Data
          </Button>
        </div>


        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onBulkToggleAvailability}>
                Toggle Availability
              </Button>
              <Button variant="destructive" size="sm" onClick={onBulkDelete}>
                Delete Selected
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}