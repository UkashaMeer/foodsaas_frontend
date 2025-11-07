'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  DollarSign,
  BarChart3,
  Plus,
  Download,
  RefreshCw,
  ChefHat,
  Activity,
  Zap,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRequireOwner } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/spinner'

// Enhanced Stat Card with professional design
const StatCard = ({ title, value, change, icon: Icon, trend = 'up', delay = 0, description }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      const end = typeof value === 'number' ? value : parseInt(value.replace(/[^0-9]/g, ''))
      const duration = 1800
      const increment = end / (duration / 16)

      let start = 0
      const counter = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(counter)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
    }, delay * 300)

    return () => clearTimeout(timer)
  }, [value, delay])

  const formatValue = () => {
    if (typeof value === 'string' && value.includes('₹')) {
      return `₹${count.toLocaleString()}`
    }
    return count.toLocaleString()
  }

  return (
    <div className={cn(
      "group relative bg-white rounded-xl border border-gray-200 p-5 transition-all duration-500 overflow-hidden",
      "hover:shadow-lg hover:border-primary/50",
      "bg-linear-to-br from-white to-gray-50/30",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )} style={{ transitionDelay: `${delay * 100}ms` }}>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300 border",
            trend === 'up'
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-red-50 text-red-600 border-red-200"
          )}>
            <Icon className="h-5 w-5" />
          </div>

          <Badge variant="secondary" className={cn(
            "text-xs font-semibold px-2 py-1 border transition-colors",
            trend === 'up'
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-red-50 text-red-700 border-red-200"
          )}>
            <TrendingUp className={cn(
              "h-3 w-3 mr-1 transition-transform",
              trend === 'up' ? "" : "rotate-180"
            )} />
            {change}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue()}
          </p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>

        {/* Enhanced progress indicator */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                trend === 'up' ? "bg-linear-to-r from-primary to-primary/80" : "bg-linear-to-r from-red-500 to-red-600"
              )}
              style={{
                width: isVisible ? (trend === 'up' ? '85%' : '45%') : '0%',
                transitionDelay: `${delay * 200 + 500}ms`
              }}
            />
          </div>
          <span className={cn(
            "text-xs font-bold ml-2",
            trend === 'up' ? "text-primary" : "text-red-600"
          )}>
            {trend === 'up' ? '85%' : '45%'}
          </span>
        </div>
      </div>
    </div>
  )
}

// Enhanced Mini Chart with animated bars and professional design
const MiniChart = ({ data, title, value, change, period = 'this week' }) => {
  const maxValue = Math.max(...data)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-500 hover:border-primary/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-linear-to-br from-primary to-transparent" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <p className="text-sm font-semibold text-gray-600">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <Badge variant="secondary" className={cn(
              "text-xs font-semibold border",
              change.startsWith('+')
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-red-50 text-red-700 border-red-200"
            )}>
              {change}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">{period}</p>
        </div>

        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Activity className="h-4 w-4" />
        </div>
      </div>

      <div className="h-16 mb-4 relative z-10">
        <div className="flex items-end justify-between h-full gap-1.5">
          {data.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-t-sm transition-all duration-1000 ease-out hover:opacity-80 relative group/bar",
                "bg-linear-to-t from-primary to-primary/80"
              )}
              style={{
                height: animated ? `${(item / maxValue) * 100}%` : '0%',
                transitionDelay: `${index * 150}ms`
              }}
            >
              {/* Hover tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {item}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <span key={index}>{day}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Enhanced Status Distribution with animated progress bars
const StatusDistribution = () => {
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const statuses = [
    { status: 'Delivered', count: 45, color: 'bg-primary', percentage: 45, icon: CheckCircle2 },
    { status: 'Preparing', count: 25, color: 'bg-orange-500', percentage: 25, icon: ChefHat },
    { status: 'On the Way', count: 15, color: 'bg-blue-500', percentage: 15, icon: Truck },
    { status: 'Pending', count: 10, color: 'bg-yellow-500', percentage: 10, icon: Clock },
    { status: 'Cancelled', count: 5, color: 'bg-red-500', percentage: 5, icon: XCircle },
  ]

  return (
    <Card className="border-gray-200 rounded-xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Package className="h-4 w-4 text-primary" />
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {statuses.map((item, index) => {
          const Icon = item.icon
          const isSelected = selectedStatus === item.status

          return (
            <div
              key={item.status}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer border",
                isSelected
                  ? "bg-primary/5 border-primary/30"
                  : "border-transparent hover:border-primary/20 hover:bg-gray-50"
              )}
              onClick={() => setSelectedStatus(isSelected ? null : item.status)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={cn(
                  "p-1.5 rounded-md shrink-0 transition-colors",
                  item.color
                )}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{item.status}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.color)}
                    style={{ width: animated ? `${item.percentage}%` : '0%' }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-900 w-6 text-right">{item.percentage}%</span>
              </div>
            </div>
          )
        })}

        {/* Summary */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Total Orders</span>
            <span className="font-semibold text-gray-900">100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Perfectly Sized Quick Actions - Professional Design
const QuickActions = () => {
  const actions = [
    {
      title: 'New Order',
      icon: Plus,
    },
    {
      title: 'Menu',
      icon: ChefHat,
    },
    {
      title: 'Customers',
      icon: Users,
    },
    {
      title: 'Reports',
      icon: BarChart3,
    },
  ]

  return (
    <Card className="border-gray-200 rounded-xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Zap className="h-4 w-4 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <button
              key={action.title}
              className={cn(
                "group flex flex-col items-center p-3 rounded-lg border border-gray-200",
                "transition-all duration-200 hover:shadow-sm hover:border-primary/40",
                "bg-white hover:bg-primary/5"
              )}
            >
              <div className="p-2 rounded-lg mb-2 bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-primary">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Recent Orders with better animations
const RecentOrders = () => {
  const orders = [
    {
      id: 'ORD-001245',
      customer: 'Aarav Sharma',
      amount: 1247,
      status: 'delivered',
      time: '2m',
      items: 3
    },
    {
      id: 'ORD-001244',
      customer: 'Priya Patel',
      amount: 899,
      status: 'preparing',
      time: '5m',
      items: 2
    },
    {
      id: 'ORD-001243',
      customer: 'Rohan Kumar',
      amount: 1549,
      status: 'on_the_way',
      time: '8m',
      items: 4
    },
    {
      id: 'ORD-001242',
      customer: 'Neha Gupta',
      amount: 649,
      status: 'pending',
      time: '12m',
      items: 1
    },
  ]

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { color: 'bg-primary/10 text-primary border-primary/20', icon: CheckCircle2 },
      preparing: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: ChefHat },
      on_the_way: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Truck },
      pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    }
    return configs[status] || configs.pending
  }

  return (
    <Card className="border-gray-200 rounded-xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-semibold">
            <Clock className="h-4 w-4 text-primary" />
            Recent Orders
          </div>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/5">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status)
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={order.id}
                className="flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={cn("p-1.5 rounded-md border transition-colors", statusConfig.color)}>
                    <StatusIcon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">{order.id}</p>
                    <p className="text-xs text-gray-600 truncate">{order.customer}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">₹{order.amount}</span>
                  <span className="text-xs text-gray-500 w-6 text-right">{order.time}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Top Performing Items with animated bars
const TopItems = () => {
  const items = [
    { name: 'Chicken Biryani', orders: 156, trend: 'up', percentage: 95 },
    { name: 'Butter Chicken', orders: 134, trend: 'up', percentage: 85 },
    { name: 'Paneer Tikka', orders: 98, trend: 'down', percentage: 65 },
    { name: 'Garlic Naan', orders: 87, trend: 'up', percentage: 55 },
  ]

  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="border-gray-200 rounded-xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <TrendingUp className="h-4 w-4 text-primary" />
          Top Items
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.name} className="group flex items-center justify-between py-1 hover:bg-gray-50 rounded-lg px-2 transition-colors">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="text-xs font-semibold text-primary group-hover:text-white">{index + 1}</span>
                </div>
                <span className="text-sm text-gray-700 truncate">{item.name}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-primary to-primary/80 transition-all duration-1000 ease-out"
                    style={{ width: animated ? `${item.percentage}%` : '0%' }}
                  />
                </div>
                <div className="flex items-center gap-1 w-12 justify-end">
                  <span className="text-xs text-gray-600">{item.orders}</span>
                  <TrendingUp className={cn(
                    "h-3 w-3 transition-transform",
                    item.trend === 'up' ? "text-primary" : "text-red-500 rotate-180"
                  )} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Performance Metrics with animated gauges
const PerformanceMetrics = () => {
  const metrics = [
    { name: 'Accuracy', value: 98, target: 95 },
    { name: 'Delivery Time', value: 92, target: 90 },
    { name: 'Satisfaction', value: 96, target: 95 },
  ]

  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 900)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="border-gray-200 rounded-xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Target className="h-4 w-4 text-primary" />
          Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-2 group hover:bg-gray-50 rounded-lg p-2 transition-colors">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{metric.name}</span>
              <span className="font-semibold text-gray-900">{metric.value}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  metric.value >= metric.target ? "bg-linear-to-r from-primary to-primary/80" : "bg-linear-to-r from-orange-500 to-orange-400"
                )}
                style={{ width: animated ? `${metric.value}%` : '0%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Target: {metric.target}%</span>
              <span className={cn(
                metric.value >= metric.target ? "text-primary" : "text-orange-500"
              )}>
                {metric.value >= metric.target ? '✓ Exceeded' : 'Below Target'}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Enhanced Animated Revenue Chart
const RevenueChart = () => {
  const revenueData = [30, 45, 35, 55, 40, 65, 50, 75, 60, 80, 70, 90]
  const maxValue = Math.max(...revenueData)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="border-gray-200 rounded-xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="h-5 w-5 text-primary" />
          Revenue Analytics
        </CardTitle>
        <CardDescription>Monthly revenue performance and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <div className="flex items-end justify-between h-40 gap-1">
            {revenueData.map((item, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-sm transition-all duration-1000 ease-out hover:opacity-80 relative group/bar bg-linear-to-t from-primary to-primary/80"
                style={{
                  height: animated ? `${(item / maxValue) * 100}%` : '0%',
                  transitionDelay: `${index * 80}ms`
                }}
              >
                {/* Hover tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  ₹{item}K
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, index) => (
              <span key={index}>{month}</span>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">₹12.4L</p>
            <p className="text-xs text-gray-600">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">+18.2%</p>
            <p className="text-xs text-gray-600">Growth</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">94%</p>
            <p className="text-xs text-gray-600">Target Achieved</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Dashboard Component with Professional Bento Layout
export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const { isOwner, isAuthenticated } = useRequireOwner('/admin/login')

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="w-full min-h-screen flex flex-col gap-2 items-center justify-center">
        <Spinner className="size-8 text-primary" />
        <span className="text-primary text-lg font-semibold">Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="w-full min-h-screen flex flex-col gap-2 items-center justify-center">
        <Spinner className="size-8 text-primary" />
        <span className="text-primary text-lg font-semibold">Loading...</span>
      </div>
    )
  }

  const statsData = [
    {
      title: "Revenue",
      value: "₹1,24,847",
      change: "+12.5%",
      icon: DollarSign,
      trend: 'up',
      description: "Total"
    },
    {
      title: "Orders",
      value: "1,247",
      change: "+8.2%",
      icon: ShoppingCart,
      trend: 'up',
      description: "Today"
    },
    {
      title: "Customers",
      value: "892",
      change: "+15.3%",
      icon: Users,
      trend: 'up',
      description: "Active"
    },
    {
      title: "Completion",
      value: "94%",
      change: "+3.1%",
      icon: CheckCircle2,
      trend: 'up',
      description: "Rate"
    },
  ]

  const revenueData = [30, 45, 35, 55, 40, 65, 50]
  const ordersData = [45, 62, 54, 71, 88, 94, 76]

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/30">
      <div className="">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm">Welcome back, here's your business overview</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-sm hover:border-primary/30 hover:text-primary"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-sm"
              >
                <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <StatCard
                key={stat.title}
                {...stat}
                delay={index}
              />
            ))}
          </div>

          {/* Main Content Grid - Professional Bento Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Revenue Chart */}
              <RevenueChart />

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MiniChart
                  data={revenueData}
                  title="Weekly Revenue"
                  value="₹1.24L"
                  change="+12.5%"
                />
                <MiniChart
                  data={ordersData}
                  title="Weekly Orders"
                  value="1,247"
                  change="+8.2%"
                />
              </div>

              {/* Bottom Row - Performance and Top Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TopItems />
                <PerformanceMetrics />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="xl:col-span-2 space-y-4">
              {/* Quick Actions */}
              <QuickActions />

              {/* Status Distribution */}
              <StatusDistribution />

              {/* Recent Orders */}
              <RecentOrders />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}