import { cn } from "@/lib/utils"

const { AlertCircle, CheckCircle2, ShoppingCart, CookingPot, Bike, Home, ShoppingBag } = require("lucide-react")
const { useState, useEffect } = require("react")

export const OrderDialogTimeline = ({ currentStatus }) => {
  const statusSteps = [
    {
      key: 'PENDING',
      label: 'Order Received',
      icon: ShoppingCart,
      color: 'bg-primary'
    },
    {
      key: 'ACCEPTED',
      label: 'Order Accepted',
      icon: CheckCircle2,
      color: 'bg-primary'
    },
    {
      key: 'PICKED_BY_RIDER',
      label: 'Picked By Rider',
      icon: ShoppingBag,
      color: 'bg-primary'
    },
    {
      key: 'ON_THE_WAY',
      label: 'On The Way',
      icon: Bike,
      color: 'bg-primary'
    },
    {
      key: 'DELIVERED',
      label: 'Delivered',
      icon: Home,
      color: 'bg-primary'
    }
  ]

  const currentIndex = statusSteps.findIndex(step => step.key === currentStatus)
  const [animatedSteps, setAnimatedSteps] = useState([])
  const isCancelled = currentStatus === 'CANCELLED'
  const isCompleted = currentStatus === 'DELIVERED'

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedSteps(Array.from({ length: currentIndex + 1 }, (_, i) => i))
    }, 300)
    return () => clearTimeout(timer)
  }, [currentIndex])

  return (
    <div className="relative">
      {/* Cancelled Message */}
      {isCancelled && (
        <div className="mb-6 flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800 font-semibold">Order has been cancelled</span>
        </div>
      )}

      {/* Completed Message */}
      {isCompleted && (
        <div className="mb-6 flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-semibold">Order delivered successfully!</span>
        </div>
      )}

      {/* Progress Bar */}
      {
        !isCompleted && !isCancelled && (
          <div className="absolute top-8 left-4 right-4 h-1 bg-muted rounded-full overflow-hidden z-0 max-sm:top-4">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>
        )
      }


      {/* Steps */}
      <div className="grid grid-cols-5 gap-2 relative z-10">
        {statusSteps.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              {/* Step Circle */}
              <div className={cn(
                "w-16 h-16 max-sm:w-8 max-sm:h-8 max-sm:border-0 rounded-full border-4 flex items-center justify-center transition-all duration-500 transform mb-3",
                "backdrop-blur-sm bg-background/40 border",
                isCompleted && "scale-110 shadow-lg",
                isCurrent && "ring-4 ring-primary/20",
              )}>
                <div className={cn(
                  "w-10 h-10 max-sm:w-6 max-sm:h-6 rounded-full flex items-center justify-center transition-all duration-500",
                  isCompleted ? step.color : "bg-muted",
                  isCurrent && "scale-125"
                )}>
                  <StepIcon className={cn(
                    "h-4 w-4 transition-all duration-500",
                    isCompleted ? "text-white" : "text-muted-foreground",
                  )} />
                </div>

                {/* Completion Check */}
                {isCompleted && index < currentIndex && (
                  <div className="absolute -top-1 -right-1">
                    <CheckCircle2 className="h-5 w-5 text-primary bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Step Label */}
              <div className="space-y-1">
                <p className={cn(
                  "text-sm font-semibold transition-colors duration-300 max-sm:hidden",
                  isCompleted ? "text-foreground" : "text-muted-foreground",
                  isCurrent && "text-primary font-bold"
                )}>
                  {step.label}
                </p>
                {isCurrent && (
                  <div className="flex justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
