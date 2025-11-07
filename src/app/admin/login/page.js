"use client"
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useLogin } from '@/api/user/auth/useLogin'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useUserLoginState } from '@/store/useUserLoginState'
import { saveToken } from "@/utils/auth";


export default function LoginPage() {
    const { mutate, isPending } = useLogin()
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const { checkLogin, isLogin, closeLogin } = useUserLoginState()

    useEffect(() => {
        if (isLogin) {
            router.push("/admin/dashboard")
        } else {
            router.push("/admin/login")
        }
    }, [checkLogin])

    const handleSubmit = async (e) => {
        e.preventDefault()

        mutate(form, {
            onSuccess: (res) => {
                try {
                    toast.success("Login Successfully.")
                    // Save token in both localStorage and cookies
                    saveToken(res.token)
                    localStorage.removeItem("guestId")

                    console.log("🔐 Token saved:", res.token)
                    console.log("👤 Role:", res?.data?.role)

                    setForm({ email: "", password: "" })
                    checkLogin()

                    // Let middleware handle the redirect
                    if (res?.data?.role === "OWNER") {
                        window.location.href = "/admin/dashboard"
                    } else {
                        window.location.href = "/"
                    }
                } catch (err) {
                    console.error("🔥 Error in onSuccess handler:", err)
                }
            },

            onError: (err) => {
                console.error("❌ onError triggered:", err)
                toast.error(err?.response?.data?.error || "Something went wrong!")
            },
        })
    }

    return (
        <main className="w-full min-h-screen flex items-center justify-center p-6 relative">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1698004760605-9f5f454d9bf9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=876)'
                }}
            />
            <div className="absolute inset-0 bg-primary/45" />

            {/* Login Card */}
            <Card className="w-full max-w-md shadow-xl border-0 relative z-10">
                <CardHeader className="text-center pb-4">
                    <img src='/logo.png' className='mx-auto w-32' />
                    <CardTitle className="text-3xl font-bold text-foreground">
                        Welcome Admin
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Sign in to your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    disabled={isPending}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
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
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button
                                type="button"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full"
                        >
                            {isPending ? "Loging in..." : "Log In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}