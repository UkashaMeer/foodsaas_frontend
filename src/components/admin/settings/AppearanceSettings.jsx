// components/admin/AppearanceSettings.jsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Image, Palette, Monitor, Moon, Sun } from 'lucide-react'

export function AppearanceSettings() {
  const [appearance, setAppearance] = useState({
    theme: 'light',
    siteName: 'FoodDelivery',
    siteDescription: 'Your favorite food delivery service',
    logo: '',
    favicon: '',
    primaryColor: '#B45309',
    language: 'en',
    timezone: 'UTC-5'
  })

  return (
    <div className="space-y-6">
      {/* Brand Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Brand Identity
          </CardTitle>
          <CardDescription>
            Customize your platform's logo and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="logo">Platform Logo</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 200x60px PNG with transparent background
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <Avatar className="h-12 w-32 bg-muted flex items-center justify-center">
                    <AvatarFallback className="bg-transparent text-foreground font-semibold">
                      {appearance.siteName}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP. Max 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Favicon Upload */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="favicon">Favicon</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 32x32px PNG
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="border-2 border-border rounded-lg p-3">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">F</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Favicon
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    ICO, PNG. Max 1MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input 
                id="siteName" 
                value={appearance.siteName}
                onChange={(e) => setAppearance({...appearance, siteName: e.target.value})}
                placeholder="Your platform name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input 
                id="siteDescription" 
                value={appearance.siteDescription}
                onChange={(e) => setAppearance({...appearance, siteDescription: e.target.value})}
                placeholder="Brief description of your platform"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme & Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme & Colors
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Theme Preference</Label>
              <div className="grid grid-cols-3 gap-3">
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    appearance.theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setAppearance({...appearance, theme: 'light'})}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      <span className="font-medium">Light</span>
                    </div>
                    <div className="h-12 rounded bg-gradient-to-r from-gray-100 to-gray-200 border"></div>
                  </div>
                </div>
                
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    appearance.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setAppearance({...appearance, theme: 'dark'})}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      <span className="font-medium">Dark</span>
                    </div>
                    <div className="h-12 rounded bg-gradient-to-r from-gray-800 to-gray-900 border"></div>
                  </div>
                </div>
                
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    appearance.theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setAppearance({...appearance, theme: 'system'})}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      <span className="font-medium">System</span>
                    </div>
                    <div className="h-12 rounded bg-gradient-to-r from-gray-100 to-gray-800 border"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                  style={{ backgroundColor: appearance.primaryColor }}
                ></div>
                <div className="flex-1">
                  <Input 
                    id="primaryColor"
                    value={appearance.primaryColor}
                    onChange={(e) => setAppearance({...appearance, primaryColor: e.target.value})}
                    placeholder="#B45309"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter a hex color code or use the color picker
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
          <CardDescription>
            Configure language and timezone settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={appearance.language} onValueChange={(value) => setAppearance({...appearance, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={appearance.timezone} onValueChange={(value) => setAppearance({...appearance, timezone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC-5">EST (UTC-5)</SelectItem>
                  <SelectItem value="UTC-8">PST (UTC-8)</SelectItem>
                  <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                  <SelectItem value="UTC+1">CET (UTC+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}