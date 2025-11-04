// components/OrderCard.jsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderStatusBadge } from './OrderStatusBadge'
import { Eye, Phone, Mail, MapPin } from 'lucide-react'
import useOrderStore from '@/store/useOrderStore'
import { format } from 'date-fns'

export const OrderCard = ({ order }) => {
  const { setSelectedOrder, setModalOpen } = useOrderStore()

  const handleViewDetails = () => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.orderedAt), 'MMM dd, yyyy · HH:mm')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <OrderStatusBadge status={order.status} />
            <OrderStatusBadge status={order.paymentStatus} type="payment" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <h4 className="font-semibold">{order.fullName}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{order.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{order.email}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5" />
            <span>{order.address}, {order.city}</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Items:</span>
            <span>{totalItems} item{totalItems > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Payment Method:</span>
            <Badge variant="outline" className="capitalize">
              {order.paymentMethod}
            </Badge>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Total:</span>
            <span>Rs. {order.totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1 flex items-center gap-2"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}