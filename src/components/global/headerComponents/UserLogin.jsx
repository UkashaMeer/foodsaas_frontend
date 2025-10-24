import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useAuthDialogState } from "@/store/useAuthDialogState";
import { useUserLoginState } from "@/store/useUserLoginState";
import { Lock, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserLogin() {
    const { isLogin, checkLogin } = useUserLoginState();
    const { openLogin, openRegister } = useAuthDialogState()
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
                        <Link href="/profile">
                            <User className='text-white cursor-pointer' />
                        </Link>
                    </div>
                ) : (
                    <div className='flex items-center gap-2'>
                        <Button onClick={() =>  openLogin() }><Lock />Login</Button>
                        <Button onClick={() =>  openRegister() }><Lock />Register</Button>
                    </div>
                )}
            </div>
            <LoginForm />
        </>
    )
}
