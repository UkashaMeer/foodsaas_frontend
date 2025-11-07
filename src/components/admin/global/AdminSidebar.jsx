"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChefHat,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/useAdminStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useItemStore } from "@/store/useItemStore";
import useOrderStore from "@/store/useOrderStore";

export const AdminSidebar = () => {

  const {
    sidebarCollapsed,
    activeMenuItem,
    toggleSidebar,
    setActiveMenuItem,
  } = useAdminStore();
  const router = useRouter()

  const { categories } = useCategoryStore()
  const { items } = useItemStore()
  const { orders } = useOrderStore()

  const menuItems = [
    { id: "dashboard", url: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "categories", url: "/admin/dashboard/categories", label: "Categories", icon: Package, badge: categories?.length },
    { id: "Items", url: "/admin/dashboard/items", label: "Items", icon: Package, badge: items?.length },
    { id: "orders", url: "/admin/dashboard/orders", label: "Orders", icon: ShoppingCart, badge: orders?.length },
    { id: "transactions", url: "/admin/dashboard/transactions", label: "Transactions", icon: CreditCard, badge: null },
    { id: "riders", url: "/admin/dashboard", label: "Riders", icon: Users, badge: "8" },
    { id: "analytics", url: "/admin/dashboard", label: "Analytics", icon: BarChart3, badge: null },
    { id: "settings", url: "/admin/dashboard", label: "Settings", icon: Settings, badge: null },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "h-screen bg-sidebar border-r border-border/40 transition-all duration-300 flex flex-col",
          "shadow-sm sticky top-0 z-30",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-border/40 shrink-0">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 p-2",
                )}>
                  <ChefHat className={cn(
                    "text-primary-foreground transition-all duration-300",
                  )} />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h1 className="text-lg font-semibold text-foreground tracking-tight truncate">
                    FoodPOS Pro
                  </h1>
                  <p className="text-xs text-muted-foreground truncate">
                    Restaurant Management
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "h-7 w-7 hover:bg-accent transition-all duration-300",
                sidebarCollapsed && "rotate-180"
              )}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenuItem === item.id;

            const menuContent = (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                onClick={() => { setActiveMenuItem(item.id); router.push(item?.url) }}
                className={cn(
                  "w-full justify-start h-10 px-3 transition-all duration-200 group relative",
                  "hover:bg-accent/50 hover:text-foreground",
                  isActive && "bg-primary/10 text-primary border-r-2 border-primary",
                  sidebarCollapsed ? "justify-center px-2" : "justify-start"
                )}
              >
                {/* Active Indicator - Only for expanded state */}
                {isActive && !sidebarCollapsed && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                )}

                <div className={cn(
                  "flex items-center gap-3 min-w-0 transition-all duration-200",
                  sidebarCollapsed ? "justify-center" : "justify-between w-full"
                )}>
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "transition-colors duration-200 shrink-0",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                        sidebarCollapsed ? "w-4 h-4" : "w-4 h-4"
                      )}
                    />
                    {!sidebarCollapsed && (
                      <span className="font-medium text-sm truncate transition-all duration-200">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!sidebarCollapsed && item.badge && (
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
            );

            return (
              <div key={item.id}>
                {sidebarCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {menuContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="px-2 py-1 text-xs">
                      {item.label}
                      {item.badge && (
                        <span className="ml-1 text-xs">({item.badge})</span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  menuContent
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-border/40 shrink-0">
            <Card className="bg-linear-to-br from-muted/50 to-muted/30 border-border/50 shadow-sm">
              <CardContent className="px-3 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-primary dark:bg-primary/30 rounded">
                    <TrendingUp className="w-3 h-3 text-white dark:text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Today's Performance
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Orders</span>
                    <span className="text-sm font-semibold text-foreground">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Revenue</span>
                    <span className="text-sm font-semibold text-foreground">PKR 12,456</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Daily Target</span>
                    <span className="text-xs font-semibold text-foreground">65%</span>
                  </div>
                  <Progress value={65} className="h-1.5 bg-muted" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};