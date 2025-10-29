"use client"

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ChefHat,
  X,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminStore } from '@/store/useAdminStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const menuItems = [
  { id: "dashboard", url: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { id: "categories", url: "/admin/dashboard/categories", label: "Categories", icon: Package, badge: null },
  { id: "products", url: "/admin/dashboard/products", label: "Products", icon: Package, badge: "12" },
  { id: "orders", url: "/admin/dashboard/orders", label: "Orders", icon: ShoppingCart, badge: "5" },
  { id: "riders", url: "/admin/dashboard", label: "Riders", icon: Users, badge: "8" },
  { id: "payments", url: "/admin/dashboard", label: "Payments", icon: CreditCard, badge: null },
  { id: "analytics", url: "/admin/dashboard", label: "Analytics", icon: BarChart3, badge: null },
  { id: "settings", url: "/admin/dashboard", label: "Settings", icon: Settings, badge: null },
];

export const AdminMobileSidebar = () => {
  const {
    mobileSidebarOpen,
    activeMenuItem,
    setActiveMenuItem,
    toggleMobileSidebar
  } = useAdminStore()
  const router = useRouter()

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId)
    toggleMobileSidebar()
  }

  if (!mobileSidebarOpen) return null

  return (
    <>
      {/* Enhanced Overlay */}
      <div 
        className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in-0 duration-300"
        onClick={toggleMobileSidebar}
      />

      {/* Enhanced Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-80 bg-sidebar border-r border-border/40 z-50 shadow-xl overflow-y-auto",
          "transform transition-transform duration-300 ease-in-out animate-in slide-in-from-left-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
                <ChefHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                  FoodPOS Pro
                </h1>
                <p className="text-xs text-muted-foreground">
                  Restaurant Management
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSidebar}
              className="h-8 w-8 hover:bg-accent/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenuItem === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                onClick={() => { handleMenuItemClick(item.id); router.push(item?.url)}}
                className={cn(
                  "w-full justify-start h-11 px-4 transition-all duration-200 relative",
                  "hover:bg-accent/50 hover:text-foreground",
                  isActive && "bg-primary/10 text-primary border-r-2 border-primary"
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                )}

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors duration-200",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className={cn(
                      "font-medium text-sm transition-colors duration-200",
                      isActive
                        ? "text-primary"
                        : "text-foreground"
                    )}>
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className={cn(
                        "h-5 px-1.5 text-xs font-medium transition-colors duration-200",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-border/40">
          <Card className="bg-linear-to-br from-muted/50 to-muted/30 border-border/50 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                  <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Today's Performance
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium">Orders</span>
                  <span className="text-sm font-semibold text-foreground">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium">Revenue</span>
                  <span className="text-sm font-semibold text-foreground">₹12,456</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium">Daily Target</span>
                  <span className="text-xs font-semibold text-foreground">65%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-linear-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-1000"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}