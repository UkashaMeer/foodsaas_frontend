"use client"

import { useGetAllCategories } from '@/api/admin/category/useGetAllCategories'
import { CategoriesPage } from '@/components/admin/categories/CategoriesPage'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'

export default function Categories() {
    const { setCategories, categories } = useCategoryStore();
    
    const { data, isSuccess, isPending, isError, error } = useQuery({
        queryKey: ["categories"],
        queryFn: useGetAllCategories
    })

    // Data ko store mein set karein - sirf tab jab data available ho aur store empty ho
    useEffect(() => {
        if (isSuccess && data && data.categories && categories.length === 0) {
            console.log("Initial data load:", data.categories);
            setCategories(data.categories);
        }
    }, [isSuccess, data, setCategories, categories.length]);

    if (isPending) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-lg md:text-2xl font-bold text-foreground">Categories</h1>
                        <p className="text-muted-foreground mt-2">Manage your product categories</p>
                    </div>
                    <div className="grid gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="text-destructive text-6xl mb-4">❌</div>
                        <h3 className="text-lg font-medium text-foreground mb-2">Error loading categories</h3>
                        <p className="text-muted-foreground mb-6">
                            {error?.message || "Failed to load categories"}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return <CategoriesPage categoriesData={data?.categories} />
}