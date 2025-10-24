import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/user/auth/login", data)
            return res.data
        }
    })
}