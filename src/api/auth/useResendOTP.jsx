import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useResendOTP = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/user/auth/resend-otp", data)
            return res.data
        } 
    })
}