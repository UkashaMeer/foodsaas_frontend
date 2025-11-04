import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

// Animated Progress Bar Component
const AnimatedProgressBar = ({ percentage, color = 'bg-primary' }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage)
    }, 300)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
      <div 
        className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = 'primary',
  progress,
  refreshKey
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      let start = 0
      const end = parseInt(value)
      const duration = 1000
      const increment = end / (duration / 16)
      
      const timerId = setInterval(() => {
        start += increment
        if (start >= end) {
          setAnimatedValue(end)
          clearInterval(timerId)
        } else {
          setAnimatedValue(Math.floor(start))
        }
      }, 16)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [value, refreshKey])


  return (
    <Card className={cn(
      "py-4! group relative overflow-hidden border-primary/25 bg-card/50 backdrop-blur-sm",
      "hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary",
      "border-l-[3px]",
    )}>
      {/* Subtle hover background */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
      )} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className={cn("text-sm font-semibold")}>
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg transition-all duration-300 group-hover:bg-primary/10",
        )}>
          <Icon className={cn("h-4 w-4")} />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-end justify-between mb-3">
          <div className="space-y-1">
            <div className={cn(
              "text-2xl font-bold transition-all duration-500"
            )}>
              {isVisible ? animatedValue.toLocaleString() : '0'}
            </div>
            {trend && (
              <Badge variant="secondary" className={cn(
                "text-xs font-normal transition-all duration-300 border-0",
                trend > 0 ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
              )}>
                <TrendingUp className={cn(
                  "h-3 w-3 mr-1 transition-transform",
                  trend > 0 ? "" : "rotate-180"
                )} />
                {Math.abs(trend)}%
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="space-y-2 mb-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <AnimatedProgressBar 
              percentage={progress} 
              color="bg-primary" 
            />
          </div>
        )}

        <p className={cn(
          "text-xs text-muted-foreground transition-colors duration-300",
          "group-hover:text-foreground/80"
        )}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

