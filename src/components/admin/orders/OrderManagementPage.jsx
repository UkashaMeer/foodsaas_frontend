import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, RefreshCw, Clock, CheckCircle2, Truck, Package, XCircle } from 'lucide-react'
import { OrderRow } from './OrderRow'
import { OrderDetailsModal } from './OrderDetailsModal'
import { OrderTable } from './OrderTable'
import { OrderFilters } from './OrderFilters'
import useOrderStore from '@/store/useOrderStore'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { StatsCard } from './OrderStatsCard'

export default function OrderManagementPage() {
  const { 
    orders, 
    filteredOrders, 
    isLoading,
    setLoading
  } = useOrderStore()

  const [refreshKey, setRefreshKey] = useState(0)

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const inProgressOrders = orders.filter(o => ['ACCEPTED', 'PREPARING', 'ON_THE_WAY'].includes(o.status)).length
  const completedOrders = orders.filter(o => o.status === 'DELIVERED').length
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length 

  const pendingPercentage = totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0
  const inProgressPercentage = totalOrders > 0 ? (inProgressOrders / totalOrders) * 100 : 0
  const completedPercentage = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
  const cancelledPercentage = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0

  const generateChartData = (baseValue, variance = 2) => {
    return Array.from({ length: 7 }, (_, i) => {
      const dayPattern = i === 0 || i === 6 ? baseValue * 0.7 : baseValue 
      const randomVariance = Math.floor(Math.random() * variance * 2 - variance)
      return Math.max(1, dayPattern + randomVariance)
    })
  }

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Customer', 'Phone', 'Total', 'Status', 'Payment Status', 'City', 'Order Date']
    const csvData = filteredOrders.map(order => [
      order.orderNumber,
      order.fullName,
      order.phoneNumber,
      order.totalPrice,
      order.status,
      order.paymentStatus,
      order.city,
      new Date(order.orderedAt).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleRefresh = async () => {
    setLoading(true)
    setRefreshKey(prev => prev + 1)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="w-full overflow-hidden mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time order management and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportCSV} 
            className="flex items-center gap-2 border transition-all duration-300 hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading} 
            className="flex items-center gap-2 transition-all duration-300 hover:bg-primary/90"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          description={`${filteredOrders.length} matching filters`}
          icon={Package}
          trend={12}
          color="primary"
          progress={100}
          chartData={generateChartData(8, 3)}
          refreshKey={refreshKey}
        />
        
        <StatsCard
          title="Pending"
          value={pendingOrders}
          description="Awaiting confirmation"
          icon={Clock}
          trend={-5}
          color="orange"
          progress={pendingPercentage}
          chartData={generateChartData(3, 1)}
          refreshKey={refreshKey}
        />
        
        <StatsCard
          title="In Progress"
          value={inProgressOrders}
          description="Being processed"
          icon={Truck}
          trend={8}
          color="blue"
          progress={inProgressPercentage}
          chartData={generateChartData(4, 2)}
          refreshKey={refreshKey}
        />
        
        <StatsCard
          title="Completed"
          value={completedOrders}
          description="Successfully delivered"
          icon={CheckCircle2}
          trend={15}
          color="green"
          progress={completedPercentage}
          chartData={generateChartData(6, 2)}
          refreshKey={refreshKey}
        />

        <StatsCard
          title="Cancelled"
          value={cancelledOrders}
          description="Cancelled orders"
          icon={XCircle}
          trend={-2}
          color="red"
          progress={cancelledPercentage}
          chartData={generateChartData(1, 1)}
          refreshKey={refreshKey}
        />
      </div>

      <Card className="border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Package className="h-5 w-5 text-primary" />
            </div>
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter orders by status, payment method, city, or date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderFilters />
        </CardContent>
      </Card>

      <Card className="border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Package className="h-5 w-5 text-primary" />
            </div>
            Orders
            <Badge variant="secondary" className="ml-2 border-0">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage and track all customer orders in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Loading orders...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden lg:block">
                <OrderTable />
              </div>
              
              <div className="lg:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 space-y-3">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-muted-foreground">No orders found matching your filters.</p>
                    <Button variant="outline" onClick={() => {/* Clear filters logic */}}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <OrderDetailsModal />
    </div>
  )
}