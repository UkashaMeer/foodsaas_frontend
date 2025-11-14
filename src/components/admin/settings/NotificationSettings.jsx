// components/admin/NotificationSettings.jsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, Mail, MessageSquare, ShoppingCart, Users } from 'lucide-react'

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Configure which email notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order-updates">Order Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about order status changes
              </p>
            </div>
            <Switch id="order-updates" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="promotional">Promotional Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive special offers and promotions
              </p>
            </div>
            <Switch id="promotional" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="security-alerts">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Important notifications about your account security
              </p>
            </div>
            <Switch id="security-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Manage your push notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-orders">New Orders</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new orders are placed
              </p>
            </div>
            <Switch id="new-orders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order-ready">Order Ready for Pickup</Label>
              <p className="text-sm text-muted-foreground">
                Notifications when orders are ready
              </p>
            </div>
            <Switch id="order-ready" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system-updates">System Updates</Label>
              <p className="text-sm text-muted-foreground">
                Important platform updates and maintenance
              </p>
            </div>
            <Switch id="system-updates" />
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            SMS Notifications
          </CardTitle>
          <CardDescription>
            Configure SMS notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-orders">Order Confirmations</Label>
              <p className="text-sm text-muted-foreground">
                Receive SMS for order confirmations
              </p>
            </div>
            <Switch id="sms-orders" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-delivery">Delivery Updates</Label>
              <p className="text-sm text-muted-foreground">
                Real-time delivery status updates
              </p>
            </div>
            <Switch id="sms-delivery" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}