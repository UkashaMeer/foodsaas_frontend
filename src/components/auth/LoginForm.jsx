import { useAuthDialogState } from "@/store/useAuthDialogState";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useLogin } from "@/api/auth/useLogin";
import { useState } from "react";
import { toast } from "sonner";
import { useUserLoginState } from "@/store/useUserLoginState";

export default function LoginForm() {
    const { mutate, isPending} = useLogin()
    const { checkLogin } = useUserLoginState()
    const { showLogin, closeLogin, openRegister } = useAuthDialogState()
    const [form, setForm] = useState({ email: "", password: "" }) 

    const handleSubmit = (e) => {
        e.preventDefault()

        mutate(form, ({
            onSuccess: (data) => {
                toast.success("Login Successfully.")
                localStorage.setItem("token", data.token)
                localStorage.removeItem("guestId")
                checkLogin()
                closeLogin()
            },
            onError: (err) => {
                toast.error(err?.response?.data?.error || "Something went wrong!")
            }
        }))
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
                            isPending ? "Logining..." : "Login"
                        }
                    </Button>
                </form>
                <span className="text-sm text-gray-500 mx-auto">
                    Don't have account? <button className="text-primary cursor-pointer underline" onClick={() => {closeLogin(); openRegister();}}>Register Now</button>
                </span>
            </DialogContent>
        </Dialog>
    )
}
