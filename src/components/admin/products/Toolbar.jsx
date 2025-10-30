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

export default function Toolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  discountFilter,
  onDiscountFilterChange,
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

  const quickFilters = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "On Discount", value: "discount" },
  ];

  return (
    <Card className="mb-6 py-0!">
      <CardContent className="p-4">
        {/* Search and Main Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
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
            <SelectTrigger className="w-full sm:w-48">
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

        {/* Category Chips */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, showCategoryChips ? categories.length : 5).map((category) => (
              <Badge
                key={category._id}
                variant={categoryFilter === category._id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onCategoryFilterChange(
                  categoryFilter === category._id ? "all" : category._id
                )}
              >
                {category.name}
              </Badge>
            ))}
            {categories.length > 5 && (
              <Badge
                variant="outline"
                className="cursor-pointer"
                onClick={() => setShowCategoryChips(!showCategoryChips)}
              >
                {showCategoryChips ? "Show Less" : `+${categories.length - 5} more`}
              </Badge>
            )}
          </div>
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