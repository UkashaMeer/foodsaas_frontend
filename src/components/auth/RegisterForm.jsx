import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRegister } from "@/api/auth/useRegister"
import { toast } from "sonner"
import { useAuthDialogState } from "@/store/useAuthDialogState"

export default function RegisterForm() {

    const { mutate, isPending } = useRegister()
    const { showRegister, closeRegister, openOTP, openLogin } = useAuthDialogState()
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
                <DialogTitle className="text-2xl font-bold">Register</DialogTitle>
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
                <span className="text-sm text-gray-500 mx-auto">
                    Already have Accoount? <button className="text-primary cursor-pointer underline" onClick={() => {openLogin(); closeRegister();}}>Login</button>
                </span>
            </DialogContent>
        </Dialog>
    )
}
