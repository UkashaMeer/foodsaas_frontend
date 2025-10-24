import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/user/auth/verify-email", data)
            return res.data
        }
    })
}