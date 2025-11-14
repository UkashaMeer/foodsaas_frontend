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
import { useRouter } from "next/navigation"

const RiderHeader = () => {
  const { removeLogin } = useUserLoginState()
  const { onlineStatus, formatTimer } = useRiderStore()
  const [notifications] = useState(3)
  const router = useRouter()

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
    <header className="h-16 border-b bg-background/95 backdrop-blur">
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
                  onClick={() => router.push("/rider/dashboard/settings")}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  onClick={handleLogout}
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
  )
}

export default RiderHeader