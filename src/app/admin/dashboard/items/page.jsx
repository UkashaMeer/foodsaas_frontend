"use client"

import { useGetAllProducts } from '@/api/admin/items/useGetAllProducts'
import ProductsPage from '@/components/admin/products/ProductPage'
import { useItemStore } from '@/store/useItemStore'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'

export default function Products() {

  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["items"],
    queryFn: useGetAllProducts
  })

  const { initializeData, loadSavedFilters, setSortBy  } = useItemStore();

  useEffect(() => {
    if (data) {
      initializeData(data);
      loadSavedFilters();
      setSortBy("newest")
    }
  }, [data, initializeData, loadSavedFilters, setSortBy]);



  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/3 mt-2 animate-pulse"></div>
          </div>

          {/* Toolbar skeleton */}
          <div className="bg-card rounded-lg p-4 shadow-sm mb-6 animate-pulse">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <div className="h-10 bg-muted rounded flex-1 max-w-md"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-muted rounded w-32"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 shadow-sm animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProductsPage />
  )
}
