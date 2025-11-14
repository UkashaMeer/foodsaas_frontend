"use client"

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react" 
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRegister } from "@/api/user/auth/useRegister"
import { toast } from "sonner"
import { useAuthDialogState } from "@/store/useAuthDialogState"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useGuestStore } from "@/store/useGuestStore"

export default function RegisterForm() {
    const { mutate, isPending } = useRegister()
    const { showRegister, closeRegister, openOTP, openLogin } = useAuthDialogState()
    const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    
    const { guestId, addresses } = useGuestStore()

    const handleSubmit = (e) => {
        e.preventDefault()

        const payload = {
            name: form.name,
            email: form.email,
            phoneNumber: form.phoneNumber,
            password: form.password,
            addresses: addresses,
            guestId: guestId
        }

        if (!payload.name || !payload.email || !payload.phoneNumber || !payload.password) {
            toast.error("Please fill all fields")
            return
        }


        if (addresses.length === 0) {
            toast.warning("No address found. You can add addresses later in your profile.")
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
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                    
                    <Button
                        type="submit"
                        className="cursor-pointer mt-2"
                        disabled={isPending || !guestId} // Disable if no guestId
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