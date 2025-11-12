"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useAuthDialogState } from "@/store/useAuthDialogState";
import { useUserLoginState } from "@/store/useUserLoginState";
import { Lock, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserLogin() {
    const { isLogin, checkLogin, removeLogin } = useUserLoginState();
    const { openLogin, openRegister } = useAuthDialogState()
    const [hydrated, setHydrated] = useState(false);
    const router = useRouter()

    useEffect(() => {
        checkLogin();
        setHydrated(true);
    }, [checkLogin, isLogin]);

    const handleLogOut = () => {
        const token = typeof window !== "undefined" && localStorage.getItem("token")
        if (token) {
            removeLogin()
            router.push("/")
            toast.message("You logged out successfully.")
        }
    }

    if (!hydrated) return null;

    return (
        <>
            <div className='flex items-center gap-1 sm:gap-2'>
                {isLogin ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 sm:h-9 sm:w-9 rounded-md bg-primary hover:bg-primary/90"
                            >
                                <User className='text-white w-4 h-4 sm:w-6 sm:h-6' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] sm:w-[200px]">
                            <DropdownMenuItem 
                                className="cursor-pointer gap-2"
                                onClick={() => router.push("/profile")}
                            >
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                                onClick={handleLogOut}
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                ) : (
                    <div className='flex items-center gap-1 sm:gap-2'>
                        {/* Mobile - Icon buttons */}
                        <div className="sm:hidden flex items-center gap-1">
                            <Button 
                                onClick={() => openLogin()} 
                                size="icon"
                                className="h-9 w-9 rounded-md"
                            >
                                <Lock className="w-4 h-4" />
                            </Button>
                            <Button 
                                onClick={() => openRegister()} 
                                size="icon"
                                variant="outline"
                                className="h-9 w-9 rounded-md"
                            >
                                <User className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        {/* Desktop - Text buttons */}
                        <div className="hidden sm:flex items-center gap-2">
                            <Button 
                                onClick={() => openLogin()} 
                                variant="outline"
                                className="gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                Login
                            </Button>
                            <Button 
                                onClick={() => openRegister()} 
                                className="gap-2"
                            >
                                <User className="w-4 h-4" />
                                Register
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <LoginForm />
        </>
    )
}