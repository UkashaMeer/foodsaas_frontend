// components/admin/categories/Toolbar.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

export default function Toolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddCategory,
  onExportCSV,
  selectedCount,
  onBulkDelete,
  onBulkToggle,
  isMobile
}) {
  return (
    <Card className="mb-6 py-0!">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search categories..."
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

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <svg className="h-4 w-4 mr-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {["all", "active", "inactive"].map((filter) => (
                  <DropdownMenuItem
                    key={filter}
                    onClick={() => onStatusFilterChange(filter)}
                    className={statusFilter === filter ? "bg-accent" : ""}
                  >
                    {filter === "all" ? "All Status" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Only`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Bulk Actions */}
            {selectedCount > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={onBulkToggle}>
                  Toggle Active
                </Button>
                <Button variant="destructive" onClick={onBulkDelete}>
                  Delete ({selectedCount})
                </Button>
              </div>
            )}

            {/* Export and Add */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onExportCSV}>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </Button>
              <Button onClick={onAddCategory}>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}