import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { createRider } from '@/api/admin/rider/createRider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function CreateRiderForm({ open, setOpen }) {
  const { mutate, isPending } = createRider()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    gender: '',
    vehicleType: '',
    accountStatus: 'ACTIVE'
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!form.name || !form.email || !form.phoneNumber || !form.password || !form.vehicleType) {
      toast.error("Please fill all required fields!")
      return
    }

    mutate(form, {
      onSuccess: (res) => {
        try {
          toast.success("Rider created successfully!")

          setForm({
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            gender: '',
            vehicleType: '',
            accountStatus: 'ACTIVE'
          })

          setOpen(false)
        } catch (err) {
          console.error("🔥 Error in onSuccess handler:", err)
        }
      },

      onError: (err) => {
        console.error("❌ Error creating rider:", err)
        toast.error(err?.response?.data?.error || "Failed to create rider!")
      },
    })
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div>
      <Dialog className="w-full max-w-md shadow-xl border-0 relative z-10" open={open} onOpenChange={setOpen}>
        <DialogContent style={{ width: '65vw', maxWidth: 'none' }}>
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Create New Rider
            </DialogTitle>
            <DialogDescription>
              Add a new rider to the system
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className='flex items-center gap-4 w-full'>
            {/* Name Input */}
            <div className="space-y-2 w-full">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter rider's full name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isPending}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2 w-full">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter rider's email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isPending}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            </div>

            <div className='flex items-center gap-4 w-full'>
            {/* Phone Number Input */}
            <div className="space-y-2 w-full">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={isPending}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 w-full">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isPending}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            </div>

            <div className='flex items-center gap-4 w-full'>
            {/* Gender Select */}
            <div className="space-y-2 w-full">
              <Label htmlFor="gender" className="text-sm font-medium text-foreground">
                Gender
              </Label>
              <Select  onValueChange={(value) => handleInputChange('gender', value)} value={form.gender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Type Select */}
            <div className="space-y-2 w-full">
              <Label htmlFor="vehicleType" className="text-sm font-medium text-foreground">
                Vehicle Type *
              </Label>
                <Select onValueChange={(value) => handleInputChange('vehicleType', value)} value={form.vehicleType} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BIKE">Bike</SelectItem>
                    <SelectItem value="SCOOTER">Scooter</SelectItem>
                    <SelectItem value="CAR">Car</SelectItem>
                    <SelectItem value="BICYCLE">Bicycle</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            {/* Active Status */}
            <div className="space-y-2 w-full">
              <Label htmlFor="accountStatus" className="text-sm font-medium text-foreground">
                Status
              </Label>
              <Select onValueChange={(value) => handleInputChange('accountStatus', value)} value={form.accountStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DEACTIVE">Deactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Creating Rider..." : "Create Rider"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}