"use client"

import { useEffect, useState } from 'react'
import { getAllRiders } from '@/api/admin/rider/getAllRiders'
import { useQuery } from '@tanstack/react-query'
import { useRidersStore } from '@/store/useRidersStore'
import { Button } from '@/components/ui/button'
import CreateRiderForm from '@/components/admin/rider/CreateRiderForm'
import RidersTable from '@/components/admin/rider/RidersTable'
import RiderFilters from '@/components/admin/rider/RiderFilters'
import Pagination from '@/components/admin/rider/Pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Plus, Package, CheckCircle, MapPin, Truck, Clock, Ban } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function Riders() {
  const { data, isPending, error } = useQuery({
    queryFn: getAllRiders,
    queryKey: ["riders"]
  })

  const { setRiders, riders } = useRidersStore()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Update store when data changes
  useEffect(() => {
    if (data?.riders) {
      setRiders(data.riders)
    }
  }, [data, setRiders])

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">
              Error loading riders: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusCounts = {
    available: riders.filter(r =>
      r.accountStatus === "ACTIVE" &&
      r.status === "ONLINE" &&
      !r.currentOrder?.orderId
    ).length,
    onDelivery: riders.filter(r =>
      r.accountStatus === "ACTIVE" &&
      r.currentOrder?.orderId &&
      r.currentOrder.status !== "DELIVERED" &&
      r.currentOrder.status !== "CANCELLED"
    ).length,
    offline: riders.filter(r =>
      r.accountStatus === "ACTIVE" &&
      r.status === "OFFLINE"
    ).length,
    inactive: riders.filter(r => r.accountStatus === "DEACTIVE").length
  }

  const performanceMetrics = {
    totalRiders: riders.length,
    activeRiders: riders.filter(r => r.accountStatus === "ACTIVE").length,
    totalOrdersToday: riders.reduce((sum, rider) => sum + (rider.ordersAssignedToday?.length || 0), 0),
    completedOrdersToday: riders.reduce((sum, rider) => sum + (rider.ordersCompletedToday?.length || 0), 0),
    successRate: riders.length > 0 ?
      ((riders.reduce((sum, rider) => sum + (rider.deliveryStats?.completedOrders || 0), 0) /
        riders.reduce((sum, rider) => sum + (rider.deliveryStats?.totalOrders || 1), 1)) * 100).toFixed(1) : 0
  }

  return (
    <div className="space-y-6" >
      {/* Header */}
      <div className="flex items-center justify-between" >
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold">Riders Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor your delivery riders
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Rider
        </Button>
      </div >

      {/* 🔥 ENHANCED: Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Total Riders</p>
                <p className="text-2xl font-bold text-blue-600">{performanceMetrics.totalRiders}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-70" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">
                {performanceMetrics.activeRiders} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Today's Orders</p>
                <p className="text-2xl font-bold text-green-600">{performanceMetrics.totalOrdersToday}</p>
              </div>
              <Package className="h-8 w-8 text-green-500 opacity-70" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                {performanceMetrics.completedOrdersToday} Completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">{performanceMetrics.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500 opacity-70" />
            </div>
            <div className="mt-2 text-xs text-purple-700">
              Overall delivery success
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900">Available Now</p>
                <p className="text-2xl font-bold text-orange-600">{statusCounts.available}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500 opacity-70" />
            </div>
            <div className="mt-2 text-xs text-orange-700">
              Ready for orders
            </div>
          </CardContent>
        </Card>
      </div >

      {/* 🔥 ENHANCED: Status Summary with Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" >
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Available</span>
                  <span className="text-lg font-bold text-green-600">{statusCounts.available}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.available / performanceMetrics.activeRiders) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Truck className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">On Delivery</span>
                  <span className="text-lg font-bold text-yellow-600">{statusCounts.onDelivery}</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.onDelivery / performanceMetrics.activeRiders) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Offline</span>
                  <span className="text-lg font-bold text-gray-600">{statusCounts.offline}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-gray-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.offline / performanceMetrics.activeRiders) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Ban className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Inactive</span>
                  <span className="text-lg font-bold text-red-600">{statusCounts.inactive}</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(statusCounts.inactive / performanceMetrics.totalRiders) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div >
      {/* Filters */}
      < RiderFilters />

      {/* Table */}
      {
        isPending ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : (
          <RidersTable />
        )
      }

      {/* Pagination */}
      <Pagination />

      {/* Create Rider Modal */}
      <CreateRiderForm
        open={createModalOpen}
        setOpen={setCreateModalOpen}
      />
    </div >
  )
}