// app/rider/components/RiderSidebar.jsx
"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Settings,
  ChevronLeft,
  Bike
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const RiderSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/rider/dashboard"
    },
    {
      id: "orders",
      label: "Assigned Orders",
      icon: Package,
      path: "/rider/dashboard/assigned-orders"
    },
    {
      id: "history",
      label: "Order History",
      icon: History,
      path: "/rider/dashboard/order-history"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/rider/dashboard/settings"
    }
  ]

  const handleNavigation = (path) => {
    router.push(path)
  }

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        "h-full bg-sidebar border-r border-border/40 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between border-b border-border/40 px-4 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-linear-to-br from-primary to-primary/80 rounded-lg p-2">
                <Bike className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="font-semibold text-foreground truncate">Rider Pro</h1>
                <p className="text-xs text-muted-foreground truncate">Delivery Partner</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7"
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            const menuContent = (
              <Button
                variant={active ? "secondary" : "ghost"}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full justify-start h-10 transition-all duration-200 group relative",
                  active && "bg-primary/10 text-primary border-r-2 border-primary",
                  collapsed ? "justify-center px-2" : "justify-start px-3"
                )}
              >
                {active && !collapsed && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                )}

                <div className={cn(
                  "flex items-center gap-3 min-w-0 transition-all duration-200",
                  collapsed ? "justify-center" : "justify-start w-full"
                )}>
                  <Icon className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    "h-4 w-4"
                  )} />
                  
                  {!collapsed && (
                    <span className="font-medium text-sm truncate">
                      {item.label}
                    </span>
                  )}
                </div>
              </Button>
            )

            return (
              <div key={item.id}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {menuContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="px-2 py-1 text-xs">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  menuContent
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </TooltipProvider>
  )
}

export default RiderSidebar