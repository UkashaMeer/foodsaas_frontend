import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatusBadge } from './OrderStatusBadge'
import { StatusUpdateDialog } from './StatusUpdateDialog'
import { AssignRiderDialog } from './AssignRiderDialog'
import {
  Phone, Mail, MapPin, Calendar, Package, CreditCard, User,
  Clock, Truck, AlertCircle, ChevronRight,
  Copy, CheckCircle2, Sparkles,
  ShoppingCart, CookingPot, Bike, Home
} from 'lucide-react'
import useOrderStore from '@/store/useOrderStore'
import { format, differenceInMinutes } from 'date-fns'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Enhanced Timeline Component
const EnhancedTimeline = ({ currentStatus }) => {
  const statusSteps = [
    {
      key: 'PENDING',
      label: 'Order Received',
      icon: ShoppingCart,
      color: 'bg-primary'
    },
    {
      key: 'ACCEPTED',
      label: 'Order Accepted',
      icon: CheckCircle2,
      color: 'bg-primary'
    },
    {
      key: 'PREPARING',
      label: 'Preparing Food',
      icon: CookingPot,
      color: 'bg-primary'
    },
    {
      key: 'ON_THE_WAY',
      label: 'On The Way',
      icon: Bike,
      color: 'bg-primary'
    },
    {
      key: 'DELIVERED',
      label: 'Delivered',
      icon: Home,
      color: 'bg-primary'
    }
  ]

  const currentIndex = statusSteps.findIndex(step => step.key === currentStatus)
  const [animatedSteps, setAnimatedSteps] = useState([])
  const isCancelled = currentStatus === 'CANCELLED'
  const isCompleted = currentStatus === 'DELIVERED'

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedSteps(Array.from({ length: currentIndex + 1 }, (_, i) => i))
    }, 300)
    return () => clearTimeout(timer)
  }, [currentIndex])

  return (
    <div className="relative">
      {/* Cancelled Message */}
      {isCancelled && (
        <div className="mb-6 flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800 font-semibold">Order has been cancelled</span>
        </div>
      )}

      {/* Completed Message */}
      {isCompleted && (
        <div className="mb-6 flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-semibold">Order delivered successfully!</span>
        </div>
      )}

      {/* Progress Bar */}
      {
        !isCompleted && !isCancelled && (
          <div className="absolute top-8 left-4 right-4 h-1 bg-muted rounded-full overflow-hidden z-0 max-sm:top-4">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>
        )
      }


      {/* Steps */}
      <div className="grid grid-cols-5 gap-2 relative z-10">
        {statusSteps.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              {/* Step Circle */}
              <div className={cn(
                "w-16 h-16 max-sm:w-8 max-sm:h-8 max-sm:border-0 rounded-full border-4 flex items-center justify-center transition-all duration-500 transform mb-3",
                "backdrop-blur-sm bg-background/40 border",
                isCompleted && "scale-110 shadow-lg",
                isCurrent && "ring-4 ring-primary/20",
              )}>
                <div className={cn(
                  "w-10 h-10 max-sm:w-6 max-sm:h-6 rounded-full flex items-center justify-center transition-all duration-500",
                  isCompleted ? step.color : "bg-muted",
                  isCurrent && "scale-125"
                )}>
                  <StepIcon className={cn(
                    "h-4 w-4 transition-all duration-500",
                    isCompleted ? "text-white" : "text-muted-foreground",
                  )} />
                </div>

                {/* Completion Check */}
                {isCompleted && index < currentIndex && (
                  <div className="absolute -top-1 -right-1">
                    <CheckCircle2 className="h-5 w-5 text-primary bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Step Label */}
              <div className="space-y-1">
                <p className={cn(
                  "text-sm font-semibold transition-colors duration-300 max-sm:hidden",
                  isCompleted ? "text-foreground" : "text-muted-foreground",
                  isCurrent && "text-primary font-bold"
                )}>
                  {step.label}
                </p>
                {isCurrent && (
                  <div className="flex justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Animated Item Card Component
const AnimatedItemCard = ({ item, index }) => {
  const product = item.itemId
  const totalAddonPrice = item.selectedAddons?.reduce(
    (sum, addon) => sum + addon.options.reduce((a, opt) => a + opt.price, 0),
    0
  ) || 0

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm",
        "hover:border-primary/50 hover:shadow-lg hover:bg-card transition-all duration-500 transform",
        "border-l-4 border-l-primary/20 hover:border-l-primary",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-0"
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Product Image */}
      <div className="shrink-0 relative">
        {product?.images?.length > 0 ? (
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg border-2 group-hover:border-primary transition-colors shadow-sm"
            />
            {product?.isOnDiscount && (
              <div className="absolute -bottom-8 left-0">
                <Badge className="bg-primary text-white text-xs px-2 py-1 shadow-lg">
                  Discount
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg bg-linear-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground shadow-sm">
            <Package className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                {product?.name || "Custom Item"}
              </h4>
              <span
                className="text-primary text-md"
              >
                ×{item.quantity}
              </span>
            </div>
            {product?.details && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                {product.details}
              </p>
            )}
          </div>
          <div className="text-right ml-4">
            <p className="font-bold text-xl text-primary">
              Rs. {item.subtotal.toLocaleString()}
            </p>
            {totalAddonPrice > 0 && (
              <p className="text-xs text-green-600 font-medium">
                +Rs. {totalAddonPrice} add-ons
              </p>
            )}
          </div>
        </div>

        {/* Addons */}
        {item.selectedAddons && item.selectedAddons.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Customizations
            </div>
            <div className="space-y-1">
              {item.selectedAddons.map((addon, addonIndex) => (
                <div
                  key={addonIndex}
                  className="flex items-center justify-between text-sm bg-primary/5 rounded-lg px-3 py-2 border border-primary/10 group-hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      {addon.categoryName}
                    </span>
                    <ChevronRight className="h-3 w-3 text-primary/40" />
                    <span className="text-primary/80">
                      {addon.options.map(opt => opt.name).join(', ')}
                    </span>
                  </div>
                  {addon.options.some(opt => opt.price > 0) && (
                    <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded text-xs">
                      +Rs. {addon.options.reduce((sum, opt) => sum + opt.price, 0)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Enhanced Customer Info Card
const CustomerInfoCard = ({ selectedOrder, copiedField, copyToClipboard }) => {
  const customerFields = [
    {
      icon: User,
      label: 'Customer Name',
      value: selectedOrder.fullName,
      field: 'customerName',
      color: 'text-primary'
    },
    {
      icon: Phone,
      label: 'Phone Number',
      value: selectedOrder.phoneNumber.toString(),
      field: 'phone',
      color: 'text-primary'
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: selectedOrder.email,
      field: 'email',
      color: 'text-primary'
    },
    {
      icon: MapPin,
      label: 'Delivery Address',
      value: `${selectedOrder.address}, ${selectedOrder.city}`,
      field: 'address',
      color: 'text-primary',
      isAddress: true
    }
  ]

  return (
    <Card className="mt-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-500 transform backdrop-blur-sm">
      <CardHeader className="p-0!">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 mx-0 p-0!">
        {customerFields.map((field, index) => {
          const FieldIcon = field.icon
          const [isVisible, setIsVisible] = useState(false)

          useEffect(() => {
            const timer = setTimeout(() => {
              setIsVisible(true)
            }, index * 150)
            return () => clearTimeout(timer)
          }, [index])

          return (
            <div
              key={field.field}
              className={cn(
                "flex items-center justify-between",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn("p-2 rounded-lg bg-primary/5", field.color)}>
                  <FieldIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{field.label}</p>
                  <p className={cn(
                    "text-sm mt-1",
                    field.isAddress ? "text-muted-foreground wrap-break-words" : "text-foreground font-mono"
                  )}>
                    {field.value}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 shrink-0"
                onClick={() => copyToClipboard(field.value, field.field)}
              >
                {copiedField === field.field ? (
                  <CheckCircle2 className="h-4 w-4 text-primary animate-pulse" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                )}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

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
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold">
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

            {/* Enhanced Timeline Section */}
            <div className="p-6 border-b bg-muted/20">
              <EnhancedTimeline currentStatus={selectedOrder.status} />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 xl:grid-cols-3 h-full">
                {/* Left Column - Order Items */}
                <div className="xl:col-span-2 flex flex-col h-full border-r">
                  {/* Quick Actions Bar */}
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
                      {selectedOrder.status !== 'CANCELLED' && (
                        <Button
                          variant="outline"
                          className="h-12 px-6 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary backdrop-blur-sm transition-all duration-300 hover:scale-105"
                        >
                          <AlertCircle className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Scrollable Order Items */}
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <Card className="border-0 p-0 shadow-none">
                      <CardHeader className="pb-0 px-0!">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="h-6 w-6 text-primary" />
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
                          <AnimatedItemCard key={item._id} item={item} index={index} />
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right Column - Information & Actions */}
                <div className="bg-muted/10 mb-4 h-full overflow-y-auto custom-scrollbar">
                  <div className="py-0! px-4 space-y-6">
                    {/* Customer Information */}
                    <CustomerInfoCard
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

                    {/* Delivery Instructions
                    {selectedOrder.instructions && (
                      <Card className="p-0!">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                              <MessageCircle className="h-5 w-5 text-yellow-600" />
                            </div>
                            Delivery Instructions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 bg-yellow-50/50 border border-yellow-200/50 rounded-xl backdrop-blur-sm">
                            <p className="text-sm text-yellow-800 leading-relaxed">
                              {selectedOrder.instructions}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )} */}

                    {/* Quick Actions */}
                    {/* <Card className="bg-linear-to-br from-card to-card/50 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          className="w-full gap-3 h-14 justify-start bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-105"
                          onClick={() => setStatusDialogOpen(true)}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-semibold">Update Order Status</div>
                            <div className="text-xs opacity-90">Change current status</div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full gap-3 h-14 justify-start backdrop-blur-sm bg-background/80 hover:bg-background transition-all duration-300 hover:scale-105"
                          onClick={() => setRiderDialogOpen(true)}
                        >
                          <Truck className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-semibold">Assign Delivery Rider</div>
                            <div className="text-xs opacity-90">Assign to available rider</div>
                          </div>
                        </Button>
                        {selectedOrder.status !== 'CANCELLED' && (
                          <Button
                            variant="outline"
                            className="w-full gap-3 h-14 justify-start text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive backdrop-blur-sm transition-all duration-300 hover:scale-105"
                          >
                            <AlertCircle className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-semibold">Cancel Order</div>
                              <div className="text-xs opacity-90">Cancel this order</div>
                            </div>
                          </Button>
                        )}
                      </CardContent>
                    </Card> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <StatusUpdateDialog />
      <AssignRiderDialog />
    </>
  )
}