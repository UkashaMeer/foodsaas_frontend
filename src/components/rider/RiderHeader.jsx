// app/rider/components/RiderHeader.jsx
"use client"

import { useState } from "react"
import { Bell, User, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useUserLoginState } from "@/store/useUserLoginState"
import { useRiderStore } from "@/store/useRiderStore"

const RiderHeader = () => {
  const { userData, removeLogin } = useUserLoginState()
  const { onlineStatus, formatTimer } = useRiderStore()
  const [notifications] = useState(3) // Mock notifications count

  const handleLogout = () => {
    removeLogin()
    window.location.href = '/rider/login'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'BUSY': return 'bg-yellow-500'
      case 'OFFLINE': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Online Status & Timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(onlineStatus)}`} />
              <span className="text-sm font-medium capitalize">{onlineStatus.toLowerCase()}</span>
            </div>
            
            {onlineStatus === 'ONLINE' && (
              <Badge variant="secondary" className="font-mono text-xs">
                ⏱️ {formatTimer()}
              </Badge>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {userData?.name || 'Rider'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.location.href = '/rider/settings'}>
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default RiderHeader