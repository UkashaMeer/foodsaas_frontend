import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderStatusBadge } from './OrderStatusBadge'
import { Eye, ChevronDown, ChevronUp } from 'lucide-react'
import useOrderStore from '@/store/useOrderStore'
import { format } from 'date-fns'

export const OrderTable = () => {
  const { filteredOrders, setSelectedOrder, setModalOpen, sort, setSort } = useOrderStore()
  const [expandedOrder, setExpandedOrder] = useState(null)

  console.log(filteredOrders)

  const handleSort = (field) => {
    if (sort.field === field) {
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      })
    } else {
      setSort({ field, direction: 'desc' })
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const SortableHeader = ({ field, children }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sort.field === field && (
          sort.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  )

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <SortableHeader field="orderedAt">Date</SortableHeader>
            <SortableHeader field="fullName">Customer</SortableHeader>
            <TableHead>Items</TableHead>
            {/* <TableHead>Location</TableHead> */}
            <SortableHeader field="totalPrice">Total</SortableHeader>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <>
              <TableRow key={order._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{order.orderNumber}</span>
                    <Badge variant="outline" className="capitalize w-fit text-xs">
                      {order.paymentMethod}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{format(new Date(order.orderedAt), 'MMM dd, yyyy')}</span>
                    <span className="text-muted-foreground">
                      {format(new Date(order.orderedAt), 'HH:mm')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.fullName}</span>
                    <span className="text-sm text-muted-foreground">{order.phoneNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      {expandedOrder === order._id ? 'Hide' : 'Show'} items
                    </Button>
                  </div>
                </TableCell>
                {/* <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{order.city}</span>
                    <span className="text-muted-foreground truncate max-w-[150px]">
                      {order.address}
                    </span>
                  </div>
                </TableCell> */}
                <TableCell className="font-semibold">
                  Rs. {order.totalPrice.toLocaleString()}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.paymentStatus} type="payment" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
              
              {/* Expanded Order Items */}
              {expandedOrder === order._id && (
                <TableRow>
                  <TableCell colSpan={9} className="bg-muted/20">
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold">Order Items</h4>
                      {order.items.map((item, index) => (
                        <div key={item._id} className="flex justify-between items-start border-b pb-3 last:border-0">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div>
                                <img className='w-20' src={item?.itemId?.images[0]} alt="" />                                
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">
                                  {item.itemId?.name || 'Custom Item'} × {item.quantity}
                                </p>
                                {item.selectedAddons && item.selectedAddons.length > 0 && (
                                  <div className="mt-1 space-y-1">
                                    {item.selectedAddons.map((addon, addonIndex) => (
                                      <div key={addonIndex} className="text-sm text-muted-foreground">
                                        <span className="font-medium">{addon.categoryName}:</span>{' '}
                                        {addon.options.map(opt => opt.name).join(', ')} 
                                        {addon.options.some(opt => opt.price > 0) && (
                                          <span> (+Rs. {addon.options.reduce((sum, opt) => sum + opt.price, 0)})</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Rs. {item.subtotal.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          Subtotal: Rs. {(order.totalPrice - order.deliveryCharges).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Delivery: Rs. {order.deliveryCharges.toLocaleString()}
                        </div>
                        <div className="font-semibold">
                          Total: Rs. {order.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No orders found matching your filters.
        </div>
      )}
    </div>
  )
}