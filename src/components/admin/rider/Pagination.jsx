"use client"

import { useRidersStore } from '@/store/useRidersStore'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Pagination() {
  const { pagination, setPagination, filteredRiders } = useRidersStore()
  
  const totalItems = filteredRiders.length
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage)
  
  const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1
  const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, totalItems)

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page })
  }

  const handleItemsPerPageChange = (value) => {
    setPagination({ 
      currentPage: 1, 
      itemsPerPage: parseInt(value) 
    })
  }

  if (totalItems === 0) return null

  return (
    <div className="flex items-center justify-between px-2">    
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={pagination.itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pagination.currentPage} of {totalPages}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
    </div>
  )
}