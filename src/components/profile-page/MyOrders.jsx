import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ChefHat, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  MessageSquare,
  History,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const OrderStatusTracker = ({ status, paymentStatus }) => {
  const statusSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
    { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2, color: 'text-blue-500' },
    { key: 'PREPARING', label: 'Preparing', icon: ChefHat, color: 'text-orange-500' },
    { key: 'ON_THE_WAY', label: 'On The Way', icon: Truck, color: 'text-purple-500' },
    { key: 'DELIVERED', label: 'Delivered', icon: Package, color: 'text-green-500' },
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.key === status) || 0;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        {statusSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          
          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-muted border-muted-foreground/25 text-muted-foreground'
              } transition-all duration-500 ease-in-out`}>
                <StepIcon className={`w-5 h-5 ${isCompleted ? 'text-primary-foreground' : step.color}`} />
              </div>
              <span className={`text-xs mt-2 text-center font-medium ${
                isCompleted ? 'text-foreground' : 'text-muted-foreground'
              } transition-colors duration-300`}>
                {step.label}
              </span>
              {isCurrent && (
                <Badge 
                  variant="secondary" 
                  className="mt-1 animate-pulse bg-primary/10 text-primary"
                >
                  Current
                </Badge>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress Line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -translate-y-1/2">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

const OrderItemCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
        isExpanded ? 'shadow-sm' : ''
      }`}
    >
      <CardContent className="p-4">
        <div 
          className="flex items-start gap-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img 
            src={item.itemId.images[0]} 
            alt={item.itemId.name}
            className="w-16 h-16 rounded-lg object-cover shrink-0 transition-transform duration-300 hover:scale-105"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground line-clamp-1">
                  {item.itemId.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.itemId.details}
                </p>
              </div>
              
              <div className="text-right shrink-0 ml-4">
                <div className="flex items-center gap-2">
                  {item.itemId.isOnDiscount ? (
                    <>
                      <span className="font-bold text-foreground">
                        Rs. {item.itemId.discountPrice}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        Rs. {item.itemId.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-foreground">
                      Rs. {item.itemId.price}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Qty: {item.quantity}
                </div>
              </div>
            </div>

            {/* Addons */}
            {item.selectedAddons && item.selectedAddons.length > 0 && (
              <div className={`mt-3 transition-all duration-300 ${
                isExpanded ? 'block' : 'hidden'
              }`}>
                <Separator className="my-2" />
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Addons:</h5>
                <div className="space-y-1">
                  {item.selectedAddons.map((addonCategory, categoryIndex) => (
                    <div key={categoryIndex} className="text-sm">
                      <span className="font-medium">{addonCategory.categoryName}:</span>
                      {' '}
                      {addonCategory.options.map((option, optionIndex) => (
                        <span key={optionIndex} className="text-muted-foreground">
                          {option.name} (Rs. {option.price})
                          {optionIndex < addonCategory.options.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <Badge 
                variant={item.itemId.isAvailable ? "default" : "destructive"}
                className="animate-fade-in"
              >
                {item.itemId.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? 'Show Less' : 'Show Addons'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderCard = ({ order, showTracker = true }) => {
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
                <Badge 
                  variant={getPaymentStatusVariant(order.paymentStatus)} 
                  className="text-xs sm:text-sm"
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
            
            {/* Order Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="sm:hidden">{formatTimeAgo(order.orderedAt)}</span>
                <span className="hidden sm:inline">{formatDate(order.orderedAt)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
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

const EmptyState = ({ type }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      {type === 'current' ? (
        <>
          <Zap className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Active Orders</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You don't have any orders in progress. Start a new order to track your delicious food journey!
          </p>
          <Button>Order Now</Button>
        </>
      ) : (
        <>
          <History className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Order History</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your order history will appear here once you complete your first order. Start ordering to build your history!
          </p>
          <Button>Start Your First Order</Button>
        </>
      )}
    </div>
  );
};

export default function MyOrders({ ordersData }) {
  const [activeTab, setActiveTab] = useState('current');

  if (!ordersData || !ordersData.orders || ordersData.orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No Orders Yet</h2>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <Link href="/">
            <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const currentOrders = ordersData.orders.filter(order => 
    order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
  );

  const orderHistory = ordersData.orders.filter(order => 
    order.status === 'DELIVERED' || order.status === 'CANCELLED'
  );

  const totalSpent = orderHistory
    .filter(order => order.status === 'DELIVERED')
    .reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="">
        {/* Header */}
        <div className="mb-4 animate-in fade-in duration-700">
          <div className="flex items-center justify-start gap-4 mt-4 flex-wrap">
            <Badge variant="default" className="text-sm rounded-md">
              {ordersData.count} Total {ordersData.count === 1 ? 'Order' : 'Orders'}
            </Badge>
            <Badge variant="outline" className="text-sm rounded-md">
              {currentOrders.length} Active
            </Badge>
            <Badge variant="outline" className="text-sm rounded-md">
              {orderHistory.length} Completed
            </Badge>
            {totalSpent > 0 && (
              <Badge variant="default" className="text-sm rounded-md">
                Total Spent: Rs. {totalSpent}
              </Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 gap-8">
              <TabsTrigger value="current" className="flex items-center gap-2 py-2 cursor-pointer border-primary">
                <Zap className="w-4 h-4" />
                Current Orders
                {currentOrders.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {currentOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 py-2 cursor-pointer border-primary">
                <History className="w-4 h-4" />
                Order History
                {orderHistory.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {orderHistory.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Current Orders Tab */}
            <TabsContent value="current" className="space-y-6">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <div 
                    key={order._id}
                    className="animate-in slide-in-from-bottom-5 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <OrderCard order={order} showTracker={true} />
                  </div>
                ))
              ) : (
                <EmptyState type="current" />
              )}
            </TabsContent>

            {/* Order History Tab */}
            <TabsContent value="history" className="space-y-6">
              {orderHistory.length > 0 ? (
                orderHistory.map((order, index) => (
                  <div 
                    key={order._id}
                    className="animate-in slide-in-from-bottom-5 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <OrderCard order={order} showTracker={false} />
                  </div>
                ))
              ) : (
                <EmptyState type="history" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}