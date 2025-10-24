import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const updateCartItem = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.put("/updateCartItem", data)
            return res.data
        }
    })
}