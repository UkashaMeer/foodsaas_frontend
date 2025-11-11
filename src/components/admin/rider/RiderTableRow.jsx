"use client"

import { useState } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MoreHorizontal, Eye, Edit, Truck, Ban, Clock, CheckCircle, XCircle, Package, CheckSquare, Target, BarChart3 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ViewRiderModal from './ViewRiderModal'
import AssignOrderModal from './AssignOrderModal'
import DeleteRiderModal from './DeleteRiderModal'
import EditRiderModal from './EditRiderModal'

export default function RiderTableRow({ rider }) {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModelOpen, setEditModelOpen] = useState(false)

  const ordersCompletedToday = rider.ordersCompletedToday?.length || 0
  const ordersAssignedToday = rider.ordersAssignedToday?.length || 0
  const totalOrders = rider.deliveryStats?.totalOrders || 0
  const completedOrders = rider.deliveryStats?.completedOrders || 0
  const cancelledOrders = rider.deliveryStats?.cancelledOrders || 0

  // Calculate success rate
  const successRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0

  // 🔥 UPDATED: Determine rider status based on new model
  const getRiderStatus = () => {
    if (rider.accountStatus === "DEACTIVE") return 'inactive'
    if (rider.status === "BUSY") return 'busy'
    if (rider.status === "ONLINE") return 'available'
    return 'offline'
  }

  const riderStatus = getRiderStatus()

  // Status-based styling
  const getStatusStyles = () => {
    switch (riderStatus) {
      case 'available':
        return 'bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500'
      case 'busy':
        return 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-500'
      case 'offline':
        return 'bg-gray-50 hover:bg-gray-100 border-l-4 border-l-gray-500'
      case 'inactive':
        return 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500'
      default:
        return 'bg-white hover:bg-gray-50'
    }
  }

  const getStatusIcon = () => {
    switch (riderStatus) {
      case 'available':
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'busy':
        return <Truck className="h-3 w-3 text-yellow-600" />
      case 'offline':
        return <Clock className="h-3 w-3 text-gray-600" />
      case 'inactive':
        return <Ban className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (riderStatus) {
      case 'available':
        return 'Online - Available for orders'
      case 'busy':
        return `On Delivery - ${rider.currentOrder?.status || 'ASSIGNED'}`
      case 'offline':
        return 'Offline - Not available'
      case 'inactive':
        return 'Account Deactivated'
      default:
        return 'Unknown'
    }
  }

  const canAssignOrder = true

  return (
    <>
      <TableRow className={getStatusStyles()}>
        <TableCell>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{rider.userId?.name || 'N/A'}</span>
              {getStatusIcon()}
            </div>
            <div className="mt-1">
              <Badge
                variant="outline"
                className={`text-xs ${riderStatus === 'available' ? 'bg-green-100 text-green-700 border-green-300' :
                  riderStatus === 'busy' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    riderStatus === 'offline' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                      'bg-red-100 text-red-700 border-red-300'
                  }`}
              >
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <Badge variant={rider.accountStatus === "ACTIVE" ? "default" : "destructive"}>
            {rider.accountStatus === "ACTIVE" ? "Active" : "Inactive"}
          </Badge>
        </TableCell>

        <TableCell>
          <Badge variant={
            rider.status === "ONLINE" ? "default" :
              rider.status === "BUSY" ? "secondary" : "outline"
          }>
            {rider.status || "OFFLINE"}
          </Badge>
        </TableCell>

        <TableCell>
          <Badge variant="outline" className="capitalize">
            {rider.vehicleType?.toLowerCase() || 'N/A'}
          </Badge>
        </TableCell>

        <TableCell>
          {rider.currentOrder?.orderId ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs">
                    ORDER {rider.currentOrder.status}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs text-white">
                    Order #{rider.currentOrder.orderId._id || 'N/A'}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Badge variant="outline" className="text-xs">
              No Current Order
            </Badge>
          )}
        </TableCell>

        {/* 🔥 ENHANCED: Compact Performance with Icons & Tooltips */}
        <TableCell>
          <TooltipProvider>
            <div className="flex items-center justify-center gap-3">
              {/* Today's Assigned */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 cursor-help">
                    <div className="relative">
                      <Package className="h-5 w-5 text-blue-600" />
                      {ordersAssignedToday > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-blue-600">
                          {ordersAssignedToday}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-medium text-blue-700">{ordersAssignedToday}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Today Assigned: {ordersAssignedToday} orders</p>
                </TooltipContent>
              </Tooltip>

              {/* Today's Completed */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 cursor-help">
                    <div className="relative">
                      <CheckSquare className="h-5 w-5 text-green-600" />
                      {ordersCompletedToday > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-green-600">
                          {ordersCompletedToday}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-medium text-green-700">{ordersCompletedToday}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Today Completed: {ordersCompletedToday} orders</p>
                </TooltipContent>
              </Tooltip>

              {/* Success Rate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 cursor-help">
                    <div className="relative">
                      <Target className={`h-5 w-5 ${successRate >= 90 ? 'text-green-600' :
                          successRate >= 75 ? 'text-yellow-600' :
                            'text-red-600'
                        }`} />
                    </div>
                    <span className={`text-xs font-medium ${successRate >= 90 ? 'text-green-700' :
                        successRate >= 75 ? 'text-yellow-700' :
                          'text-red-700'
                      }`}>
                      {successRate}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">Success Rate</p>
                    <p>{completedOrders} / {totalOrders} orders</p>
                    <p className="text-sm text-muted-foreground">Completed vs Total</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              {/* Total Performance */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 cursor-help">
                    <div className="relative">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-purple-700">{completedOrders}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">Total Performance</p>
                    <p>Completed: {completedOrders}</p>
                    <p>Cancelled: {cancelledOrders}</p>
                    <p>Total: {totalOrders}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </TableCell>

        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={!canAssignOrder}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewModalOpen(true)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAssignModalOpen(true)}
                disabled={!canAssignOrder}
              >
                <Truck className="h-4 w-4 mr-2" />
                Assign Order
                {!canAssignOrder && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Not Available
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditModelOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Rider
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteModalOpen(true)}
                className="text-red-600"
              >
                <Ban className="h-4 w-4 mr-2" />
                Delete Rider
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <ViewRiderModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        rider={rider}
      />

      <AssignOrderModal
        open={assignModalOpen}
        setOpen={setAssignModalOpen}
        rider={rider}
      />

      <EditRiderModal 
        open={editModelOpen}
        setOpen={setEditModelOpen}
        rider={rider}
      />

      <DeleteRiderModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        rider={rider}
      />
    </>
  )
}