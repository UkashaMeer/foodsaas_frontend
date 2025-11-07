import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatusBadge } from './OrderStatusBadge'
import { StatusUpdateDialog } from './StatusUpdateDialog'
import { AssignRiderDialog } from './AssignRiderDialog'
import {
  Calendar, Package, CreditCard,
  Clock, Truck, Copy, CheckCircle2
} from 'lucide-react'
import useOrderStore from '@/store/useOrderStore'
import { format, differenceInMinutes } from 'date-fns'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { OrderCustomerInfoCard } from './OrderCustomerInfoCard'
import { OrderItemCard } from './OrderItemCard'
import { OrderDialogTimeline } from './OrderDialogTimeline'


export const OrderDetailsModal = () => {
  const { selectedOrder, isModalOpen, setModalOpen, setStatusDialogOpen, setRiderDialogOpen } = useOrderStore()
  const [copiedField, setCopiedField] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [width, setWidth] = useState('90vw')

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isModalOpen])

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth > 768 ? '90vw' : '100vw')
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)

    return () => window.removeEventListener('resize', updateWidth)
  }, [])


  if (!selectedOrder) return null

  const totalItems = selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)
  const orderAge = differenceInMinutes(new Date(), new Date(selectedOrder.orderedAt))

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const getUrgencyColor = () => {
    if (orderAge > 120) return 'text-destructive bg-destructive/10 border-destructive/20'
    if (orderAge > 60) return 'text-orange-500 bg-orange-50 border-orange-200'
    return 'text-green-500 bg-green-50 border-green-200'
  }


  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-0 border-0 bg-transparent overflow-y-auto max-h-[90vh] custom-scrollbar" style={{
          width: window.innerWidth > 768 ? '90vw' : "100vw",
          maxWidth: 'none'
        }}>
          <div className={cn(
            "flex flex-col bg-background rounded-2xl shadow-2xl overflow-hidden",
            "animate-in zoom-in-95 duration-500",
            isVisible && "backdrop-blur-sm"
          )}>
            {/* Enhanced Header */}
            <DialogHeader className="relative p-6 border-b bg-linear-to-r from-primary/5 via-primary/10 to-primary/5">
              <div className="absolute inset-0 bg-grid-primary/5 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
              <div className="relative flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2">
                <div className="flex items-center gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                  <div className="p-2 bg-primary rounded-xl">
                    <Package className="h-7 w-7 max-sm:w-5 max-sm:h-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold max-sm:text-lg">
                      {selectedOrder.orderNumber}
                      <OrderStatusBadge status={selectedOrder.status} />
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Placed {format(new Date(selectedOrder.orderedAt), 'MMM dd, yyyy • hh:mm a')}
                      {orderAge > 30 && (
                        <span className={cn("ml-2 px-3 py-1 rounded-full text-xs font-medium border", getUrgencyColor())}>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {orderAge}m ago
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 backdrop-blur-sm bg-background/80 hover:bg-background"
                    onClick={() => copyToClipboard(selectedOrder.orderNumber, 'orderNumber')}
                  >
                    {copiedField === 'orderNumber' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 animate-bounce" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy Order ID
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 border-b bg-muted/20">
              <OrderDialogTimeline currentStatus={selectedOrder.status} />
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 xl:grid-cols-3 h-full">
                <div className="xl:col-span-2 flex flex-col h-full border-r">
                  {
                    selectedOrder.status !== "CANCELLED" && selectedOrder.status !== "DELIVERED" && (
                      <div className="p-4 border-b bg-linear-to-r from-muted/30 to-muted/10 backdrop-blur-sm">
                        <div className="flex gap-3">
                          <Button
                            className="flex-1 gap-3 h-12 bg-primary hover:bg-primary/90 shadow-lg"
                            onClick={() => setStatusDialogOpen(true)}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                            Update Status
                          </Button>

                          <Button
                            variant="outline"
                            className="flex-1 gap-3 h-12 backdrop-blur-sm bg-background/80"
                            onClick={() => setRiderDialogOpen(true)}
                          >
                            <Truck className="h-5 w-5" />
                            Assign Rider
                          </Button>
                        </div>
                      </div>
                    )
                  }

                  {/* Scrollable Order Items */}
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <Card className="border-0 p-0 shadow-none">
                      <CardHeader className="pb-0 px-0!">
                        <CardTitle className="flex items-center gap-3 text-xl max-sm:text-lg">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="h-6 w-6 max-sm:w-5 max-sm:h-5 text-primary" />
                          </div>
                          Order Items
                          <div className="flex items-center gap-2 ml-auto">
                            <Badge variant="secondary" className="text-sm">
                              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                            </Badge>
                            <Badge className="bg-primary text-primary-foreground text-sm">
                              Rs. {selectedOrder.totalPrice.toLocaleString()}
                            </Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 px-0!">
                        {selectedOrder.items.map((item, index) => (
                          <OrderItemCard key={item._id} item={item} index={index} />
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right Column - Information & Actions */}
                <div className="bg-muted/10 mb-4 h-full overflow-y-auto custom-scrollbar">
                  <div className="py-0! px-4 space-y-6">
                    {/* Customer Information */}
                    <OrderCustomerInfoCard
                      selectedOrder={selectedOrder}
                      copiedField={copiedField}
                      copyToClipboard={copyToClipboard}
                    />

                    {/* Order Summary */}
                    <Card className="p-4! rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-500 transform backdrop-blur-sm">
                      <CardHeader className="pb-0! px-0!">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          Order Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-0!">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">Items Total</span>
                            <span className="font-semibold">Rs. {(selectedOrder.totalPrice - selectedOrder.deliveryCharges).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">Delivery Charges</span>
                            <span className="font-semibold">Rs. {selectedOrder.deliveryCharges.toLocaleString()}</span>
                          </div>
                          {selectedOrder.discount && (
                            <div className="flex justify-between items-center py-3 border-b border-border/50">
                              <span className="text-sm text-muted-foreground">Discount</span>
                              <span className="font-semibold text-primary">-Rs. {selectedOrder.discount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-4">
                            <span className="text-lg font-bold">Total Amount</span>
                            <span className="text-lg font-bold text-primary">
                              Rs. {selectedOrder.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <StatusUpdateDialog />
      <AssignRiderDialog />
    </>
  )
}