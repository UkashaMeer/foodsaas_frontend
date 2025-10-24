import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import { useVerifyEmail } from "@/api/auth/useVerifyEmail"
import { useAuthDialogState } from "@/store/useAuthDialogState"
import { toast } from "sonner"

export default function VerifyEmailForm() {

    const { mutate, isPending } = useVerifyEmail()
    const { closeOTP, showOTP } = useAuthDialogState()
    const [otp, setOtp] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        const email = localStorage.getItem("email")
        const payload = {
            email: email,
            otp: otp
        }

        mutate(payload, {
            onSuccess: (res) => {
                toast.success("OTP Verified Successfully.")
                
                localStorage.setItem("token", res.token)

                localStorage.removeItem("email")
                localStorage.removeItem("guestId")

                closeOTP()
            },
            onError: (err) => toast.error(err?.response?.data?.error || "Something went wrong!"),
            onMutate: (err) => toast.message("Verifying")
        })
    }


    return (
        <Dialog
            open={showOTP}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
        >
            <DialogContent className="w-full">
                <form
                    className="w-full flex flex-col items-center justify-center gap-1 mt-4"
                    onSubmit={handleSubmit}
                >
                    <h1 className="text-2xl font-bold">Verify Your Email</h1>
                    <p className="text-sm mb-4 text-center">  We’ve sent a 6-digit verification code to your email address. Please check your inbox and enter the code below to continue.
                    </p>

                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                    >
                        <InputOTPGroup>
                            {[...Array(6)].map((_, i) => (
                                <InputOTPSlot
                                    key={i}
                                    index={i}
                                    disabled={isPending}
                                    className="w-16 h-16 text-2xl"
                                />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                    <div className="flex gap-4">
                        <Button className="mt-4 cursor-pointer" type="submit">
                            {
                                isPending ? "Verifying OTP..." : "Verify OTP"
                            }
                        </Button>
                        <Button className="mt-4 cursor-pointer">Resend OTP</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
