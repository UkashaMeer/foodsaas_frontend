"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserLoginState } from "@/store/useUserLoginState"
import { useRiderStore } from "@/store/useRiderStore"
import { getAssignedOrders, updateOrderStatus, getRiderByUserId, getRiderOrdersCompletedToday } from "@/api/rider/dashboard"
import { Package, MapPin, Clock, CheckCircle, Truck, User, Phone, Navigation, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { getUserId } from "@/utils/auth"

export default function AssignedOrders() {
  const { rider, setRider, setAssignedOrders, assignedOrders, ordersCompletedToday, setOrdersCompletedToday } = useRiderStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('current')

  const riderId = localStorage.getItem('riderId')

  // Fetch assigned orders
  const { data: assignedOrdersData, isLoading, refetch } = useQuery({
    queryKey: ['assigned-orders', riderId],
    queryFn: () => getAssignedOrders(riderId),
    enabled: !!riderId,
    refetchInterval: 10000,
    onSuccess: (data) => {
      setAssignedOrders(data.assignedOrders || [])
    }
  })
  const { data: orderCompletedTodayData, isLoading: orderCompletedTodayLoading } = useQuery({
    queryKey: ['orders-completed-today', riderId],
    queryFn: () => getRiderOrdersCompletedToday(riderId),
    onSuccess: (data) => {
      setOrdersCompletedToday(data.ordersAssignedToday || [])
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data, variables) => {
      toast.success(`Order status updated to ${variables.status}`)
      queryClient.invalidateQueries(['assigned-orders'])
      queryClient.invalidateQueries(['get-rider-assigned'])
      refetch()
    },
    onError: (error) => {
      toast.error("Failed to update order status")
    }
  })

  useEffect(() => {
    if (assignedOrdersData) {
      setAssignedOrders(assignedOrdersData.assignedOrders || [])
    }
  }, [assignedOrdersData, setAssignedOrders])

  const formatCurrency = (amount) => {
    return `PKR ${amount?.toLocaleString() || '0'}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PICKED_UP': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ON_THE_WAY': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED': return '✅'
      case 'PICKED_UP': return '📦'
      case 'ON_THE_WAY': return '🚚'
      case 'DELIVERED': return '🎉'
      case 'CANCELLED': return '❌'
      default: return '📋'
    }
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'ACCEPTED': return 'PICKED_UP'
      case 'PICKED_UP': return 'ON_THE_WAY'
      case 'ON_THE_WAY': return 'DELIVERED'
      default: return null
    }
  }

  const handleStatusUpdate = (orderId, status) => {
    if (!riderId) {
      toast.error("Rider information not loaded")
      return
    }

    updateStatusMutation.mutate({
      riderId,
      orderId,
      status
    })
  }

  const handleCallCustomer = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleViewRoute = (address) => {
    // Open in Google Maps
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(mapsUrl, '_blank')
  }

  const getStatusActions = (order) => {
    const nextStatus = getNextStatus(order.status)
    
    if (!nextStatus) return null

    const buttonConfig = {
      'PICKED_UP': { 
        text: 'Mark as Picked Up', 
        variant: 'default',
        icon: '📦'
      },
      'ON_THE_WAY': { 
        text: 'Start Delivery', 
        variant: 'default',
        icon: '🚚'
      },
      'DELIVERED': { 
        text: 'Mark as Delivered', 
        variant: 'success',
        icon: '✅'
      }
    }[nextStatus]

    return (
      <Button
        onClick={() => handleStatusUpdate(order._id, nextStatus)}
        disabled={updateStatusMutation.isLoading}
        variant={buttonConfig.variant === 'success' ? 'default' : 'outline'}
        className={cn(
          "gap-2",
          buttonConfig.variant === 'success' && "bg-green-600 hover:bg-green-700 text-white"
        )}
        size="sm"
      >
        <span>{buttonConfig.icon}</span>
        {buttonConfig.text}
      </Button>
    )
  }

  // Filter orders based on tab
  const currentOrders = assignedOrders?.filter(order => 
    order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
  ) || []
  const completedOrders = orderCompletedTodayData?.ordersCompletedToday

  if (!riderId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading rider information...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/rider/dashboard')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assigned Orders</h1>
            <p className="text-muted-foreground">
              Manage your current and completed delivery orders
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{assignedOrders?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Assigned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{currentOrders.length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedOrders?.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-4">
          <TabsTrigger value="current" className="flex items-center gap-2 py-2 cursor-pointer">
            <Package className="h-4 w-4" />
            Current ({currentOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2 py-2 cursor-pointer">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedOrders?.length})
          </TabsTrigger>
        </TabsList>

        {/* Current Orders Tab */}
        <TabsContent value="current" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">Loading assigned orders...</div>
              </CardContent>
            </Card>
          ) : currentOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No current orders assigned</p>
                  <p className="text-sm">New orders will appear here when assigned</p>
                  <Button 
                    onClick={() => router.push('/rider/dashboard')}
                    variant="outline"
                    className="mt-3"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {currentOrders.map((order) => (
                <Card key={order._id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Order Info */}
                      <div className="space-y-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="outline" className="font-mono text-sm">
                                #{order.orderNumber}
                              </Badge>
                              <Badge variant="secondary" className={cn("text-sm", getStatusColor(order.status))}>
                                {getStatusIcon(order.status)} {order.status.replace('_', ' ')}
                              </Badge>
                              <div className="text-lg font-semibold">
                                {formatCurrency(order.totalPrice)}
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{order.userId?.name || order.fullName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{order.phoneNumber}</span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="text-right text-sm text-muted-foreground">
                            <div>Assigned: {formatDate(order.orderedAt)}</div>
                            {order.estimatedDeliveryTime && (
                              <div>Est. Delivery: {formatDate(order.estimatedDeliveryTime)}</div>
                            )}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Delivery Address</span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-6">{order.address}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Items</span>
                            </div>
                            <div className="flex flex-wrap gap-1 pl-6">
                              {order.items?.slice(0, 3).map((item, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {item.itemId?.name} × {item.quantity}
                                </Badge>
                              ))}
                              {order.items?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{order.items.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {order.instructions && (
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="font-medium text-sm mb-1">Delivery Instructions:</div>
                            <p className="text-sm text-muted-foreground">{order.instructions}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        {getStatusActions(order)}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleViewRoute(order.address)}
                        >
                          <Navigation className="h-4 w-4" />
                          View Route
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleCallCustomer(order.phoneNumber)}
                        >
                          <Phone className="h-4 w-4" />
                          Call Customer
                        </Button>

                        {/* Progress Steps */}
                        <div className="mt-4 space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">Delivery Progress</div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              order.status === 'ACCEPTED' ? "bg-blue-500" : "bg-gray-300"
                            )} />
                            <span className={order.status === 'ACCEPTED' ? "font-medium" : "text-muted-foreground"}>Accepted</span>
                            
                            <div className="flex-1 h-0.5 bg-gray-300" />
                            
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              order.status === 'PICKED_UP' ? "bg-yellow-500" : "bg-gray-300"
                            )} />
                            <span className={order.status === 'PICKED_UP' ? "font-medium" : "text-muted-foreground"}>Picked Up</span>
                            
                            <div className="flex-1 h-0.5 bg-gray-300" />
                            
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              order.status === 'ON_THE_WAY' ? "bg-orange-500" : "bg-gray-300"
                            )} />
                            <span className={order.status === 'ON_THE_WAY' ? "font-medium" : "text-muted-foreground"}>On the Way</span>
                            
                            <div className="flex-1 h-0.5 bg-gray-300" />
                            
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              order.status === 'DELIVERED' ? "bg-green-500" : "bg-gray-300"
                            )} />
                            <span className={order.status === 'DELIVERED' ? "font-medium" : "text-muted-foreground"}>Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Completed Orders Tab */}
        <TabsContent value="completed" className="space-y-4">
          {completedOrders?.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No completed orders yet</p>
                  <p className="text-sm">Completed orders will appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedOrders?.map((order) => (
                <Card key={order._id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="outline" className="font-mono">
                            #{order.orderNumber}
                          </Badge>
                          <span className="font-semibold">{order.userId?.name || order.fullName}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            ✅ DELIVERED
                          </Badge>
                          <div className="text-sm text-muted-foreground ml-auto">
                            Delivered: {formatDate(order.deliveredAt)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{order.items?.length} items</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{order.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Assigned: {formatDate(order.orderedAt)}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {order.items?.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item.itemId?.name} × {item.quantity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(order.totalPrice)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Order Total
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          +PKR {Math.round(order.totalPrice * 0.2).toLocaleString()} earned
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}