// app/admin/dashboard/customers/components/EditCustomerModal.jsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useCustomerStore } from "@/store/useCustomerStore"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  Calendar, 
  MapPin, 
  Home, 
  Mail, 
  Phone, 
  User, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Star,
  MapPinIcon,
  Plus,
  Navigation,
  Loader2
} from "lucide-react"

const EditCustomerModal = () => {
  const { selectedCustomer, editModalOpen, setEditModalOpen, setCustomers, customers } = useCustomerStore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    dateOfBirth: "",
    gender: "MALE",
    isPhoneVerified: false,
    isEmailVerified: false,
    role: "CUSTOMER",
    orderType: "DELIVERY",
    status: "ACTIVE",
    addresses: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [newAddress, setNewAddress] = useState({
    label: "",
    address: "",
    longitude: "",
    latitude: "",
    isDefault: false
  })
  const [imagePreview, setImagePreview] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Initialize form data when customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      const formData = {
        name: selectedCustomer.name || "",
        email: selectedCustomer.email || "",
        phoneNumber: selectedCustomer.phoneNumber || "",
        profilePicture: selectedCustomer.profilePicture || "",
        dateOfBirth: selectedCustomer.dateOfBirth ? selectedCustomer.dateOfBirth.split('T')[0] : "",
        gender: selectedCustomer.gender || "MALE",
        isPhoneVerified: selectedCustomer.isPhoneVerified || false,
        isEmailVerified: selectedCustomer.isEmailVerified || false,
        role: selectedCustomer.role || "CUSTOMER",
        orderType: selectedCustomer.orderType || "DELIVERY",
        status: selectedCustomer.status || "ACTIVE",
        addresses: selectedCustomer.addresses || []
      }
      setFormData(formData)
      setImagePreview(formData.profilePicture)
    }
  }, [selectedCustomer])

  if (!selectedCustomer) return null

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (field === 'profilePicture') {
      setImagePreview(value)
    }
  }

  const handleAddressChange = (field, value) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Simulate file upload and get URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setImagePreview(imageUrl)
        handleInputChange('profilePicture', imageUrl)
        toast.success("Profile picture updated")
      }
      reader.readAsDataURL(file)
    }
  }

  // Get current location using browser's Geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser")
      return
    }

    setIsGettingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          const data = await response.json()
          
          if (data.locality) {
            const address = `${data.locality}, ${data.city || data.principalSubdivision}, ${data.countryName}`
            
            // Auto-fill the address form
            setNewAddress(prev => ({
              ...prev,
              label: "Current Location",
              address: address,
              longitude: longitude.toString(),
              latitude: latitude.toString(),
              isDefault: false
            }))
            
            toast.success("Current location captured successfully!")
          } else {
            toast.error("Could not get address from location")
          }
        } catch (error) {
          console.error("Geocoding error:", error)
          toast.error("Failed to get address from location")
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        let errorMessage = "Failed to get current location"
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow location access."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        
        toast.error(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  // Alternative simpler geocoding (if above API doesn't work)
  const getCurrentLocationSimple = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser")
      return
    }

    setIsGettingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Set coordinates and let user manually enter address
        setNewAddress(prev => ({
          ...prev,
          label: "Current Location",
          address: "Please enter your address manually",
          longitude: longitude.toString(),
          latitude: latitude.toString(),
          isDefault: false
        }))
        
        toast.success("Coordinates captured! Please enter address manually.")
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast.error("Failed to get current location. Please allow location access.")
        setIsGettingLocation(false)
      }
    )
  }

  const addAddress = () => {
    if (!newAddress.label || !newAddress.address) {
      toast.error("Please fill label and address fields")
      return
    }

    const addressToAdd = {
      ...newAddress,
      longitude: newAddress.longitude ? parseFloat(newAddress.longitude) : 0,
      latitude: newAddress.latitude ? parseFloat(newAddress.latitude) : 0
    }

    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, addressToAdd]
    }))

    setNewAddress({
      label: "",
      address: "",
      longitude: "",
      latitude: "",
      isDefault: false
    })

    toast.success("Address added successfully")
  }

  const removeAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }))
    toast.success("Address removed")
  }

  const setDefaultAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }))
    }))
    toast.success("Default address updated")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      toast.error("Please fill all required fields")
      setIsLoading(false)
      return
    }

    try {
      // Prepare data for API call
      const updateData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
      }

      // Simulate API call - Replace with actual API call
      const response = await fetch(`/api/users/${selectedCustomer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) throw new Error('Failed to update customer')

      // Update customer in store
      const updatedCustomers = customers.map(customer =>
        customer._id === selectedCustomer._id 
          ? { ...customer, ...updateData }
          : customer
      )
      
      setCustomers(updatedCustomers)
      toast.success("Customer updated successfully")
      setEditModalOpen(false)
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update customer")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200'
      case 'INACTIVE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'BLOCKED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto" style={{ width: "65vw", maxWidth: "none" }}>
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Edit Customer
          </DialogTitle>
          <DialogDescription className="text-base">
            Update profile and account information for <span className="font-semibold text-primary">{selectedCustomer.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture & Basic Info */}
          <Card className="border-2 border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Profile Picture Section */}
                <div className="flex-shrink-0">
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/50">
                            <User className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-upload"
                      />
                      <Label 
                        htmlFor="profile-upload" 
                        className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-primary/30 rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium text-primary"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </Label>
                      
                      <Input
                        value={formData.profilePicture}
                        onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                        placeholder="Or enter image URL"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter customer name"
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-medium">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter phone number"
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="border-2 border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Account Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Account Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="INACTIVE">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Inactive
                        </div>
                      </SelectItem>
                      <SelectItem value="BLOCKED">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Blocked
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderType" className="text-sm font-medium">Preferred Order Type</Label>
                  <Select value={formData.orderType} onValueChange={(value) => handleInputChange('orderType', value)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DELIVERY">🚚 Delivery</SelectItem>
                      <SelectItem value="PICKUP">🏪 Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Verification Status */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                <h4 className="font-medium mb-3 text-sm">Verification Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isEmailVerified}
                        onCheckedChange={(checked) => handleInputChange('isEmailVerified', checked)}
                      />
                      {formData.isEmailVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Phone Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isPhoneVerified}
                        onCheckedChange={(checked) => handleInputChange('isPhoneVerified', checked)}
                      />
                      {formData.isPhoneVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Management */}
          <Card className="border-2 border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-primary" />
                Address Management
              </h3>
              
              {/* Current Location Button */}
              <div className="mb-6">
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg border-0"
                >
                  {isGettingLocation ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Getting Your Location...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      Use My Current Location
                    </div>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Click to automatically detect your current location and address
                </p>
              </div>
              
              {/* Add New Address */}
              <div className="space-y-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-dashed border-primary/20">
                <h4 className="font-medium text-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="label" className="text-sm font-medium">Label</Label>
                    <Input
                      id="label"
                      value={newAddress.label}
                      onChange={(e) => handleAddressChange('label', e.target.value)}
                      placeholder="e.g., Home, Office, Villa"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={newAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      placeholder="Enter complete address with landmarks"
                      rows={2}
                      className="bg-background resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-sm font-medium">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={newAddress.longitude}
                      onChange={(e) => handleAddressChange('longitude', e.target.value)}
                      placeholder="Longitude coordinate"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-sm font-medium">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={newAddress.latitude}
                      onChange={(e) => handleAddressChange('latitude', e.target.value)}
                      placeholder="Latitude coordinate"
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newAddress.isDefault}
                      onCheckedChange={(checked) => handleAddressChange('isDefault', checked)}
                    />
                    <Label htmlFor="isDefault" className="text-sm font-medium">Set as default address</Label>
                  </div>
                  <Button 
                    type="button" 
                    onClick={addAddress} 
                    variant="default" 
                    className="gap-2"
                    disabled={!newAddress.label || !newAddress.address}
                  >
                    <MapPin className="w-4 h-4" />
                    Add Address
                  </Button>
                </div>
              </div>

              {/* Existing Addresses */}
              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">EXISTING ADDRESSES</h4>
                {formData.addresses.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No addresses added yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Add addresses to make ordering easier</p>
                  </div>
                ) : (
                  formData.addresses.map((address, index) => (
                    <div key={index} className="flex items-start justify-between p-4 bg-background rounded-lg border-2 hover:border-primary/20 transition-colors group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Home className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{address.label}</span>
                              {address.isDefault && (
                                <Badge variant="default" className="bg-primary text-primary-foreground">
                                  <Star className="w-3 h-3 mr-1 fill-current" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{address.address}</p>
                            {address.longitude && address.latitude && (
                              <p className="text-xs text-muted-foreground mt-1">
                                📍 Coordinates: {address.longitude}, {address.latitude}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!address.isDefault && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setDefaultAddress(index)}
                            className="gap-1"
                          >
                            <Star className="w-3 h-3" />
                            Default
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeAddress(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating Customer...
                </div>
              ) : (
                `Update ${selectedCustomer.name}`
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setEditModalOpen(false)}
              disabled={isLoading}
              className="h-12 px-6 border-2"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditCustomerModal