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
            <div className='flex items-center gap-2'>
                {isLogin ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className='bg-primary p-2 rounded-md relative'>
                                <User className='text-white w-5 h-5 cursor-pointer' />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                                <User />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={handleLogOut}>
                                <LogOut />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                ) : (
                    <div className='flex items-center gap-2'>
                        <Button onClick={() => openLogin()}><Lock />Login</Button>
                        <Button onClick={() => openRegister()}><Lock />Register</Button>
                    </div>
                )}
            </div>
            <LoginForm />
        </>
    )
}
