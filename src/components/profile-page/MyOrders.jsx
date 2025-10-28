import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package,
  History,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { OrderCard } from './MyOrdersComponents/OrderCard';
import { EmptyState } from './MyOrdersComponents/EmptyState';

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