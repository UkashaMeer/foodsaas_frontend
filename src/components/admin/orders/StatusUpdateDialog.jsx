'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from './OrderStatusBadge'
import useOrderStore from '@/store/useOrderStore'
import { useUpdateOrderStatus } from '@/api/admin/orders/useUpdateOrderStatus'
import { toast } from 'sonner'
import { useState } from 'react'

const statusFlow = {
  PENDING: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['ON_THE_WAY', 'CANCELLED'],
  ON_THE_WAY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
}

export const StatusUpdateDialog = () => {
  const { mutate } = useUpdateOrderStatus()
  const { 
    selectedOrder, 
    isStatusDialogOpen, 
    setStatusDialogOpen, 
    updateOrderStatus 
  } = useOrderStore()
  
  const [updatingStatus, setUpdatingStatus] = useState(null)

  if (!selectedOrder) return null

  const availableStatuses = statusFlow[selectedOrder.status] || []

  const handleStatusUpdate = (status, orderId) => {
    setUpdatingStatus(status)
    
    const payload = {
      orderId: orderId,
      status: status
    }

    mutate(payload, {
      onSuccess: (res) => {
        // ✅ Local state update
        updateOrderStatus(orderId, status)
        
        toast.success("Status Updated Successfully.")
        console.log(res)
        
        setUpdatingStatus(null)
        setStatusDialogOpen(false)
      },
      onError: () => {
        toast.error("Something went wrong while updating status")
        setUpdatingStatus(null)
        setStatusDialogOpen(false)
      }
    })
  }

  return (
    <Dialog open={isStatusDialogOpen} onOpenChange={setStatusDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{selectedOrder.orderNumber}</p>
              <p className="text-sm text-muted-foreground">{selectedOrder.fullName}</p>
            </div>
            <OrderStatusBadge status={selectedOrder.status} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Update status to:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableStatuses.map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  className="h-auto py-3 flex flex-col gap-1"
                  onClick={() => handleStatusUpdate(status, selectedOrder._id)}
                  disabled={updatingStatus === status}
                >
                  {updatingStatus === status ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <OrderStatusBadge status={status} />
                  )}
                </Button>
              ))}
              {availableStatuses.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-2 text-center py-4">
                  No further status updates available
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStatusDialogOpen(false)}
              disabled={!!updatingStatus}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}