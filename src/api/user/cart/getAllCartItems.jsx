import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const getAllCartItems = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/getAllCartItems", data)
            return res.data
        },
        mutationKey: ["cartItems"],
    })
}