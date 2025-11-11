"use client"

import { useRidersStore } from '@/store/useRidersStore'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import RiderTableRow from './RiderTableRow'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Truck, Ban, Users, MapPin, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function RidersTable() {
  const { getPaginatedRiders, loading, riders, filteredRiders } = useRidersStore()
  const paginatedRiders = getPaginatedRiders()

  // 🔥 ENHANCED: Count riders by new status system with better logic
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

  // 🔥 NEW: Performance metrics


  if (loading) {
    return <TableSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* 🔥 ENHANCED: Results Count */}
      {filteredRiders.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{paginatedRiders.length}</span> of{' '}
            <span className="font-semibold">{filteredRiders.length}</span> riders
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {statusCounts.available} Available for orders
          </Badge>
        </div>
      )}

      {/* 🔥 ENHANCED: Table with better styling */}
      <Card className="border shadow-sm py-0! overflow-hidden">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead className="font-semibold text-gray-900">Rider Info & Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Account</TableHead>
              <TableHead className="font-semibold text-gray-900">Online Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Vehicle</TableHead>
              <TableHead className="font-semibold text-gray-900">Current Order</TableHead>
              <TableHead className="font-semibold text-gray-900">Performance</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRiders.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Users className="h-12 w-12 opacity-50" />
                    <p className="text-lg font-medium">No riders found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              paginatedRiders.map((rider) => (
                <RiderTableRow key={rider._id} rider={rider} />
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton for performance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton for status cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton for table */}
      <Card>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <td>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </td>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j}>
                    <Skeleton className="h-6 w-16 mx-auto" />
                  </td>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}