// app/rider/dashboard/order-history/page.jsx
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useUserLoginState } from "@/store/useUserLoginState"
import { getOrderHistory } from "@/api/rider/dashboard"
import { Package, DollarSign, Calendar, MapPin } from "lucide-react"

export default function OrderHistory() {
  const { userData } = useUserLoginState()
  const [period, setPeriod] = useState('today')
  const riderId = userData?._id

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['order-history', riderId, period],
    queryFn: () => getOrderHistory(riderId, period),
    enabled: !!riderId
  })

  const formatCurrency = (amount) => {
    return `PKR ${amount?.toLocaleString() || '0'}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateEarning = (order) => {
    return order.deliveryCharges || Math.round(order.totalPrice * 0.2)
  }

  if (!riderId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading rider information...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">
          Track your completed deliveries and earnings
        </p>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {historyData?.totalOrders || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(historyData?.totalEarnings || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {period === 'today' ? 'Today' : 
                 period === 'week' ? 'This Week' : 
                 period === 'month' ? 'This Month' : 'All Time'}
              </div>
              <div className="text-sm text-muted-foreground">Period</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Tabs */}
      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">Loading order history...</div>
              </CardContent>
            </Card>
          ) : !historyData?.orders || historyData.orders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No orders found for this period</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {historyData.orders.map((order) => (
                <Card key={order._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{order.orderNumber}</Badge>
                          <span className="font-semibold">{order.userId?.name}</span>
                          <Badge variant="secondary" className="ml-auto">
                            DELIVERED
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{order.items?.length} items</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>Earned: {formatCurrency(calculateEarning(order))}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(order.deliveredAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{order.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(order.totalPrice)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Order Total
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