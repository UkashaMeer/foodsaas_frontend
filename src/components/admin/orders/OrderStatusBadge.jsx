import { Badge } from '@/components/ui/badge'

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  ACCEPTED: { label: 'Accepted', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  PREPARING: { label: 'Preparing', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  ON_THE_WAY: { label: 'On The Way', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-300' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300' },
}

const paymentStatusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-800 border-green-300' },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-800 border-red-300' },
}

export const OrderStatusBadge = ({ status, type = 'order' }) => {
  const config = type === 'payment' ? paymentStatusConfig : statusConfig
  const statusInfo = config[status] || { label: status, color: 'bg-gray-100 text-gray-800' }

  return (
    <Badge variant="outline" className={`${statusInfo.color} font-medium`}>
      {statusInfo.label}
    </Badge>
  )
}