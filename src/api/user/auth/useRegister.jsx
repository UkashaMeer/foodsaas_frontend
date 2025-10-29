import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useRegister = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/user/auth/register", data)
            return res.data
        }
    })
}