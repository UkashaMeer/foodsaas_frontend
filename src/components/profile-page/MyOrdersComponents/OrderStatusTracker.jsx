import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChefHat, Clock, Package, Truck } from "lucide-react";

export const OrderStatusTracker = ({ status, paymentStatus }) => {
  const statusSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
    { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2, color: 'text-blue-500' },
    { key: 'PICKED_BY_RIDER', label: 'Picked By Rider', icon: ChefHat, color: 'text-orange-500' },
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