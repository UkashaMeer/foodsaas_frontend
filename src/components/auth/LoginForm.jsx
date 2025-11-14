import { useAuthDialogState } from "@/store/useAuthDialogState";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useLogin } from "@/api/user/auth/useLogin";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserLoginState } from "@/store/useUserLoginState";
import { saveToken } from "@/utils/auth";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useGuestStore } from "@/store/useGuestStore";

export default function LoginForm() {
    const { mutate, isPending } = useLogin()
    const { checkLogin } = useUserLoginState()
    const { showLogin, closeLogin, openRegister } = useAuthDialogState()
    const [form, setForm] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const { guestId } = useGuestStore()

    const handleSubmit = (e) => {
        e.preventDefault()

        const payload = {
            email: form.email,
            password: form.password,
            guestId: guestId
        }

        console.log(payload)

        mutate(payload, {
            onSuccess: (res) => {
                toast.success("Login Successfully.")
                saveToken(res.token)
                localStorage.removeItem("guestId")

                setForm({ email: "", password: "" })
                checkLogin() 

                window.location.href = res.data.role === "OWNER" ? "/admin/dashboard" : res.data.role === "RIDER" ? "/rider/dashboard" : "/"
            },
            onError: (err) => {
                toast.error(err?.response?.data?.error || "Something went wrong!")
            }
        })
    }

    return (
        <Dialog className="flex text-center px-4" open={showLogin} onOpenChange={closeLogin}>
            <DialogContent>
                <DialogTitle className="text-2xl font-bold">Login</DialogTitle>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <Input
                        type="Email"
                        placeholder="Enter Email"
                        className=""
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        disabled={isPending}
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
                    <Button type="submit" className="cursor-pointer">
                        {
                            isPending ? "Logining..." : "Login"
                        }
                    </Button>
                </form>
                <span className="text-sm text-gray-500 mx-auto">
                    Don't have account? <button className="text-primary cursor-pointer underline" onClick={() => { closeLogin(); openRegister(); }}>Register Now</button>
                </span>
            </DialogContent>
        </Dialog>
    )
}