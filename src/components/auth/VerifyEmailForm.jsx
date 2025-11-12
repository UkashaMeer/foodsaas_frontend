// components/auth/VerifyEmailForm.jsx
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
import { useVerifyEmail } from "@/api/user/auth/useVerifyEmail"
import { useAuthDialogState } from "@/store/useAuthDialogState"
import { toast } from "sonner"
import { useResendOTP } from "@/api/user/auth/useResendOTP"
import { useUserLoginState } from "@/store/useUserLoginState"

export default function VerifyEmailForm() {
    const { mutate, isPending } = useVerifyEmail()
    const { mutate: resendOTPMutate, isPending: resendOTPIsPending } = useResendOTP()
    const { closeOTP, showOTP } = useAuthDialogState()
    const { checkLogin } = useUserLoginState();
    const [otp, setOtp] = useState()

    const handleResendOTP = () => {
        const email = localStorage.getItem("email")
        const payload = {
            email: email,
        }

        resendOTPMutate(payload, {
            onSuccess: (res) => {
                toast.success("OTP sent to your email.")
            },
            onError: (err) => toast.error(err?.response?.data?.error || "Something went wrong!"),
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const email = localStorage.getItem("email")
        const payload = {
            email: email,
            otp: otp
        }

        mutate(payload, {
            onSuccess: (res) => {
                toast.success("Email verified successfully!")

                localStorage.setItem("token", res.token)
                localStorage.removeItem("email")
                localStorage.removeItem("guestId")
                checkLogin()
                closeOTP()
            },
            onError: (err) => toast.error(err?.response?.data?.error || "Something went wrong!"),
            onMutate: () => toast.message("Verifying OTP...")
        })
    }

    return (
        <Dialog
            open={showOTP}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
        >
            <DialogContent className="w-full max-w-sm p-2 sm:max-w-md">
                <form
                    className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6 p-2 sm:p-6"
                    onSubmit={handleSubmit}
                >
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                            Verify Your Email
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                            We've sent a 6-digit code to your email. Enter it below to continue.
                        </p>
                    </div>

                    {/* OTP Input */}
                    <div className="w-full flex justify-center">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            disabled={isPending}
                        >
                            <InputOTPGroup className="gap-2 sm:gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <InputOTPSlot
                                        key={i}
                                        index={i}
                                        disabled={isPending}
                                        className={`
                                            w-10 h-10 sm:w-12 sm:h-12 
                                            text-lg sm:text-xl 
                                            border-2 
                                            rounded-lg
                                            transition-all
                                            focus:ring-2 focus:ring-primary
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            ${otp?.[i] ? 'border-primary' : 'border-input'}
                                        `}
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-3">
                        {/* Verify Button */}
                        <Button
                            type="submit"
                            disabled={!otp || otp.length !== 6 || isPending}
                            className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                            size="lg"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </div>
                            ) : (
                                "Verify Email"
                            )}
                        </Button>

                        {/* Resend OTP Button */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResendOTP}
                            disabled={resendOTPIsPending}
                            className="w-full h-10 text-sm sm:text-base"
                        >
                            {resendOTPIsPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                "Resend Verification Code"
                            )}
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="text-center space-y-2">
                        <p className="text-xs text-muted-foreground">
                            Didn't receive the code?
                        </p>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendOTPIsPending}
                            className="text-xs text-primary hover:text-primary/80 underline transition-colors disabled:opacity-50"
                        >
                            Click here to resend
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}