import { 
  Package, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { OrderItemCard } from "./OrderItemCard"
import { OrderStatusTracker } from "./OrderStatusTracker"

export const OrderCard = ({ order, showTracker = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInHours = Math.floor((now - orderDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const getStatusVariant = (status) => {
    const variants = {
      PENDING: 'secondary',
      CONFIRMED: 'default',
      PREPARING: 'default',
      OUT_FOR_DELIVERY: 'default',
      DELIVERED: 'default',
      CANCELLED: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const getPaymentStatusVariant = (status) => {
    const variants = {
      PENDING: 'secondary',
      PAID: 'default',
      FAILED: 'destructive',
      REFUNDED: 'outline'
    };
    return variants[status] || 'secondary';
  };

  const isCompletedOrder = order.status === 'DELIVERED' || order.status === 'CANCELLED';

  return (
    <Card className={`overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5 py-0! ${
      isCompletedOrder ? 'border-l-green-500' : 'border-l-primary'
    }`}>
      <CardHeader className="pt-4">
        {/* Header Section - Optimized for Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Order Number and Status Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <CardTitle className="text-lg font-semibold sm:text-xl line-clamp-1">
                Order #{order.orderNumber}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={getStatusVariant(order.status)} 
                  className={`text-xs sm:text-sm ${isCompletedOrder ? '' : 'animate-pulse'}`}
                >
                  {order.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            {/* Order Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="sm:hidden">{formatTimeAgo(order.orderedAt)}</span>
                <span className="hidden sm:inline">{formatDate(order.orderedAt)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="w-4 h-4 shrink-0" />
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-foreground">
                <span>Rs. {order.totalPrice}</span>
              </div>
            </div>

            {/* Item Count Preview */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
              {order.instructions && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Has instructions
                </span>
              )}
            </div>
          </div>
          
          {/* Expand Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:self-start transition-all duration-300 hover:bg-accent shrink-0"
          >
            <span className="sm:inline hidden">
              {isExpanded ? 'Show Less' : 'View Details'}
            </span>
            <span className="sm:hidden inline">
              {isExpanded ? 'Less' : 'Details'}
            </span>
          </Button>
        </div>
        
        {/* Order Status Tracker - Only show for active orders */}
        {showTracker && !isCompletedOrder && (
          <div className="mt-4">
            <OrderStatusTracker status={order.status} paymentStatus={order.paymentStatus} />
          </div>
        )}
        
        {/* Completion Badge for History */}
        {isCompletedOrder && (
          <div className="mt-3">
            <Badge 
              variant={order.status === 'DELIVERED' ? 'default' : 'destructive'} 
              className="text-sm w-full sm:w-auto justify-center"
            >
              {order.status === 'DELIVERED' ? '✅ Order Delivered' : '❌ Order Cancelled'}
            </Badge>
          </div>
        )}
      </CardHeader>

      {/* Expandable Content */}
      <div className={`transition-all duration-500 overflow-hidden ${
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <Separator />
        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <OrderItemCard key={item._id} item={item} />
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery Information & Order Summary */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Information
              </h3>
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{order.fullName}</p>
                  <p className="text-sm text-muted-foreground mt-1">{order.address}</p>
                  <p className="text-sm text-muted-foreground">{order.city}</p>
                </div>
                <Separator />
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {order.phoneNumber}
                  </span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {order.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Order Summary
              </h3>
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items Total</span>
                    <span>Rs. {order.items.reduce((sum, item) => sum + item.subtotal, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Charges</span>
                    <span>Rs. {order.deliveryCharges}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total Amount</span>
                    <span>Rs. {order.totalPrice}</span>
                  </div>
                </div>

                {/* Special Instructions */}
                {order.instructions && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium flex items-center gap-2 mb-2 text-sm">
                      <MessageSquare className="w-4 h-4" />
                      Special Instructions
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{order.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Phone className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
