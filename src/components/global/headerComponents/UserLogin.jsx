import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useAuthDialogState } from "@/store/useAuthDialogState";
import { useUserLoginState } from "@/store/useUserLoginState";
import { Lock, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserLogin() {
    const { isLogin, checkLogin } = useUserLoginState();
    const { openLogin } = useAuthDialogState()
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        checkLogin();
        setHydrated(true);
    }, [checkLogin]);

    if (!hydrated) return null;

    return (
        <>
            <div className='flex items-center gap-2'>
                {isLogin ? (
                    <div className='bg-primary p-2 rounded-md relative'>
                        <User className='text-white cursor-pointer' />
                    </div>
                ) : (
                    <div className='flex items-center gap-2'>
                        <Button onClick={() => { console.log("clicking"); openLogin() }}><Lock />Login</Button>
                        <Button><Lock />Register</Button>
                    </div>
                )}
            </div>
            <LoginForm />
        </>
    )
}
