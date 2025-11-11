import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { updateRider } from '@/api/admin/rider/updateRider'

export default function EditRiderModal({ open, setOpen, rider }) {

    const { mutate } = updateRider()

    const [form, setForm] = useState({
        riderId: rider._id,
        fullName: rider.userId.name,
        email: rider.userId.email,
        phoneNumber: rider.userId.phoneNumber,
        password: '',
        gender: rider.userId.gender,
        vehicleType: rider.vehicleType,
        accountStatus: rider.accountStatus,
        status: rider.status,
        currentLocation: {
            address: rider.currentLocation?.address || "",
            longitude: rider.currentLocation?.longitude || "",
            latitude: rider.currentLocation?.latitude || "",
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const handleInputChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleLocationChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            currentLocation: {
                ...prev.currentLocation,
                [field]: value
            }
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setIsPending(true)

        mutate(form, {
            onSuccess: (res) => {
                toast.success("Rider updated successfully.")
                setOpen(false)
            },
            onError: (err) => {
                toast.error("Something went wrong while updating rider!")
                console.log(err)
            }
        })
    }


    console.log(rider)


    return (
        <Dialog className="w-full max-w-md shadow-xl border-0 relative z-10" open={open} onOpenChange={setOpen}>
            <DialogContent style={{ width: '65vw', maxWidth: 'none' }}>
                <DialogHeader className="text-center pb-4">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                        Edit {rider.userId.name}
                    </DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Personal Info Row */}
                    <div className='flex items-center gap-4 w-full'>
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
                                    value={form.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    disabled={isPending}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

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

                    {/* Contact Info Row */}
                    <div className='flex items-center gap-4 w-full'>
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

                        <div className="space-y-2 w-full">
                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password (Leave empty to keep current)
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={form.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    disabled={isPending}
                                    className="pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isPending}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Location Info Row */}
                    <div className='flex items-center gap-4 w-full'>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="address" className="text-sm font-medium text-foreground">
                                Current Address
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="address"
                                    type="text"
                                    placeholder="Enter current address"
                                    value={form.currentLocation.address}
                                    onChange={(e) => handleLocationChange('address', e.target.value)}
                                    disabled={isPending}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="longitude" className="text-sm font-medium text-foreground">
                                Longitude
                            </Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                placeholder="Enter longitude"
                                value={form.currentLocation.longitude}
                                onChange={(e) => handleLocationChange('longitude', e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="latitude" className="text-sm font-medium text-foreground">
                                Latitude
                            </Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                placeholder="Enter latitude"
                                value={form.currentLocation.latitude}
                                onChange={(e) => handleLocationChange('latitude', e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {/* Status & Vehicle Row */}
                    <div className='flex items-center gap-4 w-full'>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="gender" className="text-sm font-medium text-foreground">
                                Gender
                            </Label>
                            <Select onValueChange={(value) => handleInputChange('gender', value)} value={form.gender} disabled={isPending}>
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

                        <div className="space-y-2 w-full">
                            <Label htmlFor="vehicleType" className="text-sm font-medium text-foreground">
                                Vehicle Type *
                            </Label>
                            <Select onValueChange={(value) => handleInputChange('vehicleType', value)} value={form.vehicleType} disabled={isPending} required>
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

                        <div className="space-y-2 w-full">
                            <Label htmlFor="status" className="text-sm font-medium text-foreground">
                                Online Status
                            </Label>
                            <Select onValueChange={(value) => handleInputChange('status', value)} value={form.status} disabled={isPending}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ONLINE">Online</SelectItem>
                                    <SelectItem value="OFFLINE">Offline</SelectItem>
                                    <SelectItem value="BUSY">Busy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="accountStatus" className="text-sm font-medium text-foreground">
                                Account Status
                            </Label>
                            <Select onValueChange={(value) => handleInputChange('accountStatus', value)} value={form.accountStatus} disabled={isPending}>
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
                        {isPending ? "Updating Rider..." : `Update ${rider.userId.name}`}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
