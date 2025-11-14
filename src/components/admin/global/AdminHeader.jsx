"use client";

import { useEffect, useRef } from "react";
import {
  Bell,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
};

export const AdminHeader = () => {
  const {
    notificationsOpen,
    profileDropdownOpen,
    setNotificationsOpen,
    setProfileDropdownOpen,
    closeAllDropdowns,
    toggleMobileSidebar,
  } = useAdminStore();

  const { userData } = useUserLoginState()
  console.log(userData)

  useClickOutside(closeAllDropdowns);
  const { removeLogin, userRole } = useUserLoginState()
  const router = useRouter()


  const handleLogOut = () => {
    removeLogin()

    if (userRole === 'OWNER') {
      router.push('/admin/login')
    } else {
      router.push('/')
    }

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

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(notificationsRef, () => setNotificationsOpen(false));
  useClickOutside(profileRef, () => setProfileDropdownOpen(false));

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
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-9 sm:w-9 rounded-md bg-primary hover:bg-primary/90"
                >
                  <User className='text-white w-4 h-4 sm:w-6 sm:h-6' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] sm:w-[200px]">
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => router.push("/admin/dashboard/settings")}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  onClick={handleLogOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
