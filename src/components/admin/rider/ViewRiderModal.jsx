"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Calendar, Truck, Shield, User, Activity, Package, CheckCircle, Clock, Navigation, ChevronDown, ChevronUp, Utensils } from 'lucide-react'

export default function ViewRiderModal({ open, setOpen, rider }) {
  if (!rider) return null

  const [activeTab, setActiveTab] = useState("assigned")
  const [expandedOrders, setExpandedOrders] = useState({})

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "secondary", label: "Pending", icon: Clock },
      ACCEPTED: { variant: "default", label: "Accepted", icon: CheckCircle },
      PREPARING: { variant: "default", label: "Preparing", icon: Clock },
      READY: { variant: "default", label: "Ready", icon: Package },
      ON_THE_WAY: { variant: "default", label: "On the Way", icon: Navigation },
      DELIVERED: { variant: "default", label: "Delivered", icon: CheckCircle },
      CANCELLED: { variant: "destructive", label: "Cancelled", icon: Clock }
    }
    
    const config = statusConfig[status] || { variant: "secondary", label: status, icon: Clock }
    const StatusIcon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <StatusIcon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentBadge = (paymentStatus) => {
    const config = {
      PAID: { variant: "default", label: "Paid" },
      PENDING: { variant: "secondary", label: "Pending" },
      FAILED: { variant: "destructive", label: "Failed" }
    }
    
    const paymentConfig = config[paymentStatus] || { variant: "secondary", label: paymentStatus }
    return <Badge variant={paymentConfig.variant}>{paymentConfig.label}</Badge>
  }

  const OrderItems = ({ items }) => (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <h5 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-900">
        <Utensils className="h-4 w-4" />
        Ordered Items ({items.length})
      </h5>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item._id || index} className="flex items-start gap-3 p-2 bg-white rounded border border-gray-200">
            {item.itemId?.images?.[0] && (
              <img 
                src={item.itemId.images[0]} 
                alt={item.itemId.name}
                className="w-12 h-12 rounded object-cover border border-gray-200"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h6 className="font-medium text-sm text-gray-900">{item.itemId?.name || 'Unknown Item'}</h6>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Rs. {item.subtotal}</p>
                  {item.itemId?.discountPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      Rs. {item.itemId.price}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Addons */}
              {item.selectedAddons?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {item.selectedAddons.map((addon, addonIndex) => (
                    <div key={addon._id || addonIndex} className="text-xs">
                      <span className="font-medium text-gray-700">{addon.categoryName}:</span>
                      {addon.options.map((option, optIndex) => (
                        <span key={option._id || optIndex} className="ml-1 text-gray-600">
                          {option.name} (+Rs.{option.price})
                          {optIndex < addon.options.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const OrderCard = ({ order, showStatus = true }) => {
    const isExpanded = expandedOrders[order._id]
    
    return (
      <Card className="border-l-2 border-l-primary hover:shadow-md transition-shadow bg-white">
        <CardContent className="py-0!">
          <div className="space-y-3">
            {/* Order Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Order #{order._id?.slice(-8) || 'N/A'}</h4>
                  <p className="text-xs text-gray-500">{formatTime(order.orderedAt)}</p>
                </div>
              </div>
              <div className="text-right">
                {showStatus && getStatusBadge(order.status)}
                <div className="text-sm font-semibold text-green-600 mt-1">Rs. {order.totalPrice}</div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{order.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-gray-500" />
                <span className="text-sm text-gray-700">{order.phoneNumber}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 text-gray-500 mt-0.5" />
                <div>
                  <span className="text-sm block text-gray-700">{order.address}</span>
                  <span className="text-xs text-gray-500">{order.city}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-4 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-primary hover:text-primary hover:bg-primary/10 border border-gray-300"
                  onClick={() => toggleOrderExpansion(order._id)}
                >
                  {order.items?.length || 0} Items
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ChevronDown className="h-3 w-3 ml-1" />
                  )}
                </Button>
                <span className="flex items-center gap-1 text-gray-600">
                  <CheckCircle className="h-3 w-3" />
                  {getPaymentBadge(order.paymentStatus)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(order.orderedAt)}
              </div>
            </div>

            {/* Expandable Items Section */}
            {isExpanded && order.items && (
              <OrderItems items={order.items} />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const EmptyState = ({ message, icon: Icon }) => (
    <div className="text-center py-12 text-gray-500">
      <Icon className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <p className="text-lg font-medium text-gray-700">{message}</p>
      <p className="text-sm mt-2">No orders found in this category</p>
    </div>
  )

  // 🔥 CALCULATE SUCCESS RATE
  const successRate = rider.deliveryStats?.totalOrders > 0 
    ? Math.round((rider.deliveryStats.completedOrders / rider.deliveryStats.totalOrders) * 100) 
    : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white" style={{ width: "70vw", maxWidth: "none" }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <User className="h-5 w-5 text-primary" />
            Rider Details - {rider.userId?.name || 'N/A'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Main Rider Card */}
          <Card className="border-l-4 border-l-primary bg-white shadow-sm">
            <CardContent className="py-0!">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Section - Personal Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{rider.userId?.name || 'N/A'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize bg-gray-100 text-gray-700 border-gray-300">
                          {rider.userId?.gender?.toLowerCase() || 'Not specified'}
                        </Badge>
                        <Badge variant="outline" className="capitalize bg-gray-100 text-gray-700 border-gray-300">
                          {rider.vehicleType?.toLowerCase() || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">{rider.userId?.email || 'N/A'}</span>
                      <Badge variant={rider.userId?.isEmailVerified ? "default" : "outline"} className="text-xs">
                        {rider.userId?.isEmailVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">{rider.userId?.phoneNumber || 'N/A'}</span>
                      <Badge variant={rider.userId?.isPhoneVerified ? "default" : "outline"} className="text-xs">
                        {rider.userId?.isPhoneVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Right Section - Status & Stats */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-gray-700">Account Status</span>
                      </div>
                      <Badge variant={rider.accountStatus === "ACTIVE" ? "default" : "destructive"} className="text-xs">
                        {rider.accountStatus === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Truck className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-gray-700">Online Status</span>
                      </div>
                      <Badge variant={
                        rider.status === "ONLINE" ? "default" :
                        rider.status === "BUSY" ? "secondary" : "outline"
                      } className="text-xs">
                        {rider.status || "OFFLINE"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="text-2xl font-bold text-primary">
                        {rider.deliveryStats?.totalOrders || 0}
                      </div>
                      <p className="text-xs text-gray-500">Total Orders</p>
                    </div>
                    <div className="text-center p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="text-2xl font-bold text-green-600">
                        {successRate}%
                      </div>
                      <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Vehicle:</span>
                    <span className="text-gray-600 capitalize">{rider.vehicleType?.toLowerCase() || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="text-gray-600">{rider.userId?.role || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Joined:</span>
                    <span className="text-gray-600">{formatDate(rider.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <span className="text-gray-600">{formatDate(rider.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🔥 UPDATED: Current Order Highlight */}
          {rider.currentOrder?.orderId && (
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Navigation className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Currently Delivering Order
                    </h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Order #{rider.currentOrder.orderId._id?.slice(-8) || 'N/A'}</p>
                      <p>Status: <Badge variant="outline">{rider.currentOrder.status}</Badge></p>
                      {rider.currentOrder.deliveryInstruction && (
                        <p>Instructions: {rider.currentOrder.deliveryInstruction}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="bg-yellow-600">
                      On Delivery
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Assigned: {formatTime(rider.currentOrder.assignedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Orders Tabs Section */}
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4 py-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-2 gap-2 bg-gray-100">
                  <TabsTrigger 
                    value="assigned" 
                    className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <Package className="h-4 w-4" />
                    Assigned Orders
                    <Badge variant="secondary" className="ml-1 bg-white text-gray-700 border border-gray-300">
                      {rider.assignedOrders?.length || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="todayAssigned" 
                    className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <Clock className="h-4 w-4" />
                    Today's Assigned
                    <Badge variant="secondary" className="ml-1 bg-white text-gray-700 border border-gray-300">
                      {rider.ordersAssignedToday?.length || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="todayCompleted" 
                    className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Today's Completed
                    <Badge variant="secondary" className="ml-1 bg-white text-gray-700 border border-gray-300">
                      {rider.ordersCompletedToday?.length || 0}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                {/* Assigned Orders Tab */}
                <TabsContent value="assigned" className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                      <Package className="h-5 w-5 text-primary" />
                      All Assigned Orders ({rider.assignedOrders?.length || 0})
                    </h3>
                    {rider.assignedOrders?.length > 0 ? (
                      <div className="grid gap-4 max-h-96 overflow-y-auto">
                        {rider.assignedOrders.map((order, index) => (
                          <OrderCard key={order._id || index} order={order} showStatus={true} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        message="No Assigned Orders" 
                        icon={Package}
                      />
                    )}
                  </div>
                </TabsContent>

                {/* Today's Assigned Orders Tab */}
                <TabsContent value="todayAssigned" className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                      <Clock className="h-5 w-5 text-primary" />
                      Orders Assigned Today ({rider.ordersAssignedToday?.length || 0})
                    </h3>
                    {rider.ordersAssignedToday?.length > 0 ? (
                      <div className="grid gap-4 max-h-96 overflow-y-auto">
                        {rider.ordersAssignedToday.map((order, index) => (
                          <OrderCard key={order._id || index} order={order} showStatus={true} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        message="No Orders Assigned Today" 
                        icon={Clock}
                      />
                    )}
                  </div>
                </TabsContent>

                {/* Today's Completed Orders Tab */}
                <TabsContent value="todayCompleted" className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Orders Completed Today ({rider.ordersCompletedToday?.length || 0})
                    </h3>
                    {rider.ordersCompletedToday?.length > 0 ? (
                      <div className="grid gap-4 max-h-96 overflow-y-auto">
                        {rider.ordersCompletedToday.map((order, index) => (
                          <OrderCard key={order._id || index} order={order} showStatus={false} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        message="No Orders Completed Today" 
                        icon={CheckCircle}
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}