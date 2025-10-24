import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRegister } from "@/api/auth/useRegister"
import { toast } from "sonner"
import { useAuthDialogState } from "@/store/useAuthDialogState"

export default function RegisterForm() {

    const { mutate, isPending } = useRegister()
    const {showRegister, closeRegister, openOTP} = useAuthDialogState()
    const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", password: "" })

    const handleSubmit = (e) => {
        e.preventDefault()

        mutate(form, {
            onSuccess: () => {
                toast.success("Registered Successfully")
                localStorage.setItem("email", form.email)
                setForm({ name: "", email: "", phoneNumber: "", password: "" })
                closeRegister()
                openOTP()
            },
            onError: (error) => toast.error(error?.response?.data?.error || "Something went wrong!"),
            onMutate: () => toast.message("Registering...")
        });

    }

    return (
        <Dialog className="flex text-center px-4" open={showRegister} onOpenChange={closeRegister}>
            <DialogContent>
                <h1 className="text-2xl font-bold">Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <Input
                        type="text"
                        placeholder="Enter Full Name"
                        className=""
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        disabled={isPending}
                    />
                    <Input
                        type="Email"
                        placeholder="Enter Email"
                        className=""
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        disabled={isPending}
                    />
                    <Input
                        type="text"
                        placeholder="Enter Phone Number"
                        className=""
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        disabled={isPending}
                    />
                    <Input
                        type="password"
                        placeholder="Enter Password"
                        className=""
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        disabled={isPending}
                    />
                    <Button type="submit" className="cursor-pointer">
                        {
                            isPending ? "Registering..." : "Register"
                        }
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
