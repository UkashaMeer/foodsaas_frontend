"use client"

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRegister } from "@/api/user/auth/useRegister"
import { toast } from "sonner"
import { useAuthDialogState } from "@/store/useAuthDialogState"

export default function RegisterForm() {
    const { mutate, isPending } = useRegister()
    const { showRegister, closeRegister, openOTP, openLogin } = useAuthDialogState()
    const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", password: "" })
    const [isClient, setIsClient] = useState(false)
    
    const [registrationData, setRegistrationData] = useState({
        addresses: [],
        guestId: null
    })

    useEffect(() => {
        setIsClient(true)
        
        if (typeof window !== 'undefined') {
            const savedAddress = localStorage.getItem('userAddress')
            const savedGuestId = localStorage.getItem('guestId')
            
            const addresses = []
            let guestId = null

            if (savedAddress) {
                try {
                    const addressData = JSON.parse(savedAddress)
                    const formattedAddress = {
                        label: addressData.label || 'Home',
                        address: addressData.address,
                        longitude: addressData.longitude,
                        latitude: addressData.latitude,
                        isDefault: true
                    }
                    addresses.push(formattedAddress)
                    console.log("📍 Loaded address:", formattedAddress)
                } catch (error) {
                    console.error('Error parsing saved address:', error)
                }
            }

            if (savedGuestId) {
                guestId = savedGuestId
            }

            setRegistrationData({
                addresses: addresses,
                guestId: guestId
            })
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        const payload = {
            name: form.name,
            email: form.email,
            phoneNumber: form.phoneNumber,
            password: form.password,
            addresses: registrationData.addresses,
            guestId: registrationData.guestId
        }

        if (!payload.name || !payload.email || !payload.phoneNumber || !payload.password) {
            toast.error("Please fill all fields")
            return
        }

        mutate(payload, {
            onSuccess: (res) => {
                toast.success("Registered Successfully")                
                localStorage.setItem("email", form.email)
                setForm({ name: "", email: "", phoneNumber: "", password: "" })
                closeRegister()
                openOTP()
            },
            onError: (error) => {
                console.error("❌ Registration Error:", error)
                toast.error(error?.response?.data?.error || "Something went wrong!")
            },
            onMutate: () => toast.message("Registering...")
        });
    }

    return (
        <Dialog className="flex text-center px-4" open={showRegister} onOpenChange={closeRegister}>
            <DialogContent>
                <DialogTitle className="text-2xl font-bold">Register</DialogTitle>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <Input
                        type="text"
                        placeholder="Enter Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        disabled={isPending}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Enter Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        disabled={isPending}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Enter Phone Number"
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        disabled={isPending}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Enter Password (min 6 characters)"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        disabled={isPending}
                        required
                        minLength={6}
                    />
                    
                    <Button 
                        type="submit" 
                        className="cursor-pointer mt-2"
                        disabled={isPending}
                    >
                        {isPending ? "Registering..." : "Create Account"}
                    </Button>
                </form>
                
                <span className="text-sm text-gray-500 mx-auto mt-4">
                    Already have Account?{" "}
                    <button 
                        className="text-primary cursor-pointer underline" 
                        onClick={() => { openLogin(); closeRegister(); }}
                        disabled={isPending}
                    >
                        Login
                    </button>
                </span>
            </DialogContent>
        </Dialog>
    )
}