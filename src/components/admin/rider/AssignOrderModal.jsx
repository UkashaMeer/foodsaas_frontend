"use client"

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Search, MapPin, Clock, DollarSign, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { getAllPendingOrders } from '@/api/admin/orders/getAllPendingOrders'
import { assignOrderToRider } from '@/api/admin/orders/assignOrderToRider'

export default function AssignOrderModal({ open, setOpen, rider }) {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [form, setForm] = useState({
    priority: 'normal',
    notes: ''
  })

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryFn: getAllPendingOrders,
    queryKey: ['pendingOrders'],
    enabled: open
  })

  const { mutate: assignOrder } = assignOrderToRider()

  const orders = ordersData?.pendingOrders || []

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders

    return orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phoneNumber.toString().includes(searchQuery)
    )
  }, [searchQuery, orders])

  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedOrder) {
      toast.error('Please select an order to assign')
      return
    }

    setLoading(true)

    const payload = {
      riderId: rider._id,
      orderId: selectedOrder._id,
      deliveryInstructions: form.notes,
    }

    console.log(payload)

    assignOrder(payload, {
      onSuccess: (res) => {
        toast.success(`Order ${selectedOrder.orderNumber} assigned to ${rider.userId.name} successfully!`)
        setOpen(false)
        resetForm()
        console.log(res)
      },
      onError: () => {
        console.error('Error assigning order:', error)
        toast.error('Failed to assign order. Please try again.')
      }
    })
  }

  const resetForm = () => {
    setSelectedOrder(null)
    setForm({ priority: 'normal', notes: '' })
    setSearchQuery('')
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "secondary", label: "Pending" },
      ACCEPTED: { variant: "default", label: "Accepted" },
      PREPARING: { variant: "default", label: "Preparing" },
      READY: { variant: "default", label: "Ready" },
      PICKED_UP: { variant: "default", label: "Picked Up" },
      DELIVERED: { variant: "default", label: "Delivered" },
      CANCELLED: { variant: "destructive", label: "Cancelled" }
    }

    const config = statusConfig[status] || { variant: "secondary", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ width: "80vw", maxWidth: "none" }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Assign Order to Rider
          </DialogTitle>
          <DialogDescription>
            Select an order from the list to assign it to {rider?.userId?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh]">
          {/* Left Side - Orders List */}
          <div className="space-y-4  pb-6">
            <div className="space-y-3">
              <Label>Select Order to Assign</Label>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by order number, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Orders List */}
              <div className="border rounded-lg overflow-hidden max-h-[50vh] overflow-y-auto">
                {ordersLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No pending orders found</p>
                    {searchQuery && (
                      <p className="text-sm mt-2">Try adjusting your search terms</p>
                    )}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredOrders.map((order) => (
                      <Card
                        key={order._id}
                        className={`border-0 rounded-none cursor-pointer transition-colors ${selectedOrder?._id === order._id
                          ? 'bg-primary/10 border-l-2 border-l-primary'
                          : 'hover:bg-muted/50'
                          }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{order.orderNumber}</span>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="text-right text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(order.orderedAt)}
                                </div>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-1 text-sm">
                              <div className="font-medium">{order.fullName}</div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{order.address}</span>
                              </div>
                              <div className="text-muted-foreground">{order.phoneNumber}</div>
                            </div>

                            {/* Order Details */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  <span>{order.items?.length || 0} items</span>
                                </div>
                                <div className="flex items-center gap-1 text-green-600 font-semibold">
                                  <span>Rs. {order.totalPrice}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {order.paymentStatus?.toLowerCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Assignment Form */}
          <div className="space-y-4 border-l pl-6  pb-6">
            <div className="space-y-4">
              {/* Selected Order Preview */}
              {selectedOrder ? (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Selected Order
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Order:</span>
                      <span>{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Customer:</span>
                      <span>{selectedOrder.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Amount:</span>
                      <span className="font-semibold">Rs. {selectedOrder.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select an order from the list</p>
                </div>
              )}

              {/* Rider Info */}
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <h4 className="font-semibold mb-2">Assigning to Rider</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{rider.userId.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Vehicle:</span>
                    <span className="capitalize">{rider.vehicleType?.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge variant={rider.isActive ? "default" : "secondary"}>
                      {rider.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Assignment Options */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Delivery Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions for the rider..."
                    value={form.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false)
                    resetForm()
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={loading || !selectedOrder}
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  {loading ? "Assigning..." : `Assign to ${rider.userId.name}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}