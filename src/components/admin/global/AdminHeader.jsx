"use client";

import { useEffect } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/useAdminStore";
import { useUserLoginState } from "@/store/useUserLoginState";
import { useRouter } from "next/navigation";

// Custom Hook for Click Outside
const useClickOutside = (callback) => {
  useEffect(() => {
    const handleClick = () => callback();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [callback]);
};

export const AdminHeader = () => {
  const {
    searchOpen,
    notificationsOpen,
    profileDropdownOpen,
    setSearchOpen,
    setNotificationsOpen,
    setProfileDropdownOpen,
    closeAllDropdowns,
    toggleMobileSidebar,
  } = useAdminStore();

  // Close dropdowns when clicking outside
  useClickOutside(closeAllDropdowns);
  const { removeLogin, userRole } = useUserLoginState()
  const router = useRouter()


  const handleLogOut = () => {
    removeLogin()

    // Redirect based on previous role
    if (userRole === 'OWNER') {
      router.push('/admin/login')
    } else {
      router.push('/')
    }

    // Optional: Force reload to clear any cached state
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const notifications = [
    { id: 1, title: "New order received", time: "2 min ago", unread: true },
    { id: 2, title: "Payment processed", time: "1 hour ago", unread: true },
    { id: 3, title: "Inventory low", time: "3 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/40">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Left Section - Mobile Menu & Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          {/* <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Welcome back! Here's your business overview.
            </p>
          </div> */}
        </div>

        <div className="flex items-center gap-2 lg:gap-4">

          {/* Search Bar */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-xl shadow-lg p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    placeholder="Search menus, orders, analytics..."
                    className="w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-sm"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotificationsOpen(!notificationsOpen);
              }}
              className="p-2 rounded-lg hover:bg-accent transition-colors relative"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-background">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-xl shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {unreadCount} unread
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors",
                        notification.unread &&
                        "bg-blue-50/50 border-l-2 border-l-blue-500"
                      )}
                    >
                      <p className="font-medium text-sm text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-border">
                  <button className="w-full text-center py-2 text-sm text-primary hover:bg-accent rounded-lg transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-primary-foreground">
                  AM
                </span>
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-foreground">
                  Admin Manager
                </p>
                <p className="text-xs text-muted-foreground">
                  Restaurant Owner
                </p>
              </div>

              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200 hidden lg:block",
                  profileDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-12 w-64 bg-popover border border-border rounded-xl shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-foreground">
                        AM
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Admin Manager
                      </p>
                      <p className="text-sm text-muted-foreground">
                        admin@foodpos.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </button>
                </div>

              </div>
            )}
          </div>
          <div className="p-2 ">
            <button onClick={handleLogOut} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
