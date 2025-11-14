// app/admin/settings/page.jsx
"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
} from 'lucide-react'
import { ProfileSettings } from '@/components/admin/settings/ProfileSettings'
import { AppearanceSettings } from '@/components/admin/settings/AppearanceSettings'
import { NotificationSettings } from '@/components/admin/settings/NotificationSettings'
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your profile and system preferences</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-border shadow-sm py-0!">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tabs Navigation */}
              <div className="border-b border-border">
                <TabsList className="h-14 w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger 
                    value="profile" 
                    className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary h-14 px-6"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appearance" 
                    className="rounded-none  border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary h-14 px-6"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="rounded-none  border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary h-14 px-6"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="rounded-none  border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary h-14 px-6"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Profile Tab */}
              <TabsContent value="profile" className="p-6 space-y-6">
                <ProfileSettings />
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="p-6 space-y-6">
                <AppearanceSettings />
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="p-6 space-y-6">
                <NotificationSettings />
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="p-6 space-y-6">
                <SecuritySettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}