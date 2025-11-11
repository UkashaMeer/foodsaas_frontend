// app/rider/settings/page.jsx
"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserLoginState } from "@/store/useUserLoginState"
import { getRiderByUserId, updateRider } from "@/api/rider/dashboard"
import { User, Bike, MapPin, Shield } from "lucide-react"
import { toast } from "sonner"

export default function RiderSettings() {
  const { userData } = useUserLoginState()
  const queryClient = useQueryClient()
  const userId = userData?._id

  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    vehicleType: '',
    currentLocation: {
      address: '',
      latitude: '',
      longitude: ''
    }
  })

  // Fetch rider data
  const { data: riderData, isLoading } = useQuery({
    queryKey: ['rider-profile', userId],
    queryFn: () => getRiderByUserId(userId),
    enabled: !!userId,
    onSuccess: (data) => {
      if (data.rider) {
        setFormData({
          name: data.rider.userId?.name || '',
          email: data.rider.userId?.email || '',
          phoneNumber: data.rider.userId?.phoneNumber || '',
          vehicleType: data.rider.vehicleType || '',
          currentLocation: {
            address: data.rider.currentLocation?.address || '',
            latitude: data.rider.currentLocation?.latitude || '',
            longitude: data.rider.currentLocation?.longitude || ''
          }
        })
      }
    }
  })

  // Update rider mutation
  const updateMutation = useMutation({
    mutationFn: updateRider,
    onSuccess: () => {
      toast.success("Profile updated successfully!")
      queryClient.invalidateQueries(['rider-profile'])
    },
    onError: (error) => {
      toast.error("Failed to update profile")
    }
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      currentLocation: {
        ...prev.currentLocation,
        [field]: value
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!riderData?.rider?._id) {
      toast.error("Rider information not loaded")
      return
    }

    updateMutation.mutate({
      riderId: riderData.rider._id,
      ...formData
    })
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handleLocationChange('latitude', latitude.toString())
          handleLocationChange('longitude', longitude.toString())
          toast.success("Location captured! Please enter address manually.")
        },
        (error) => {
          toast.error("Failed to get current location")
        }
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your rider profile and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Bike className="h-4 w-4" />
            Vehicle
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle Tab */}
        <TabsContent value="vehicle">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>
                Update your vehicle details for delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select 
                    value={formData.vehicleType} 
                    onValueChange={(value) => handleInputChange('vehicleType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BIKE">Motorcycle</SelectItem>
                      <SelectItem value="SCOOTER">Scooter</SelectItem>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="BICYCLE">Bicycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? "Updating..." : "Update Vehicle"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Current Location</CardTitle>
              <CardDescription>
                Update your current location for better order matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.currentLocation.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                    placeholder="Enter your current address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.currentLocation.latitude}
                      onChange={(e) => handleLocationChange('latitude', e.target.value)}
                      placeholder="Latitude coordinate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.currentLocation.longitude}
                      onChange={(e) => handleLocationChange('longitude', e.target.value)}
                      placeholder="Longitude coordinate"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={getCurrentLocation}
                    className="gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Use Current Location
                  </Button>
                  <Button type="submit" disabled={updateMutation.isLoading}>
                    {updateMutation.isLoading ? "Updating..." : "Update Location"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}