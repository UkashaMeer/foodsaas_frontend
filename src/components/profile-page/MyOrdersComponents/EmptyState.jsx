import { Button } from "@/components/ui/button";
import { History, Zap } from "lucide-react";
import Link from "next/link";

export const EmptyState = ({ type }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      {type === 'current' ? (
        <>
          <Zap className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Active Orders</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You don't have any orders in progress. Start a new order to track your delicious food journey!
          </p>
          <Link href="/">
            <Button>Order Now</Button>
          </Link>
        </>
      ) : (
        <>
          <History className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Order History</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your order history will appear here once you complete your first order. Start ordering to build your history!
          </p>
          <Link href="/">
            <Button>Start Your First Order</Button>
          </Link>
        </>
      )}
    </div>
  );
};