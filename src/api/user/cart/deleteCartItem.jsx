import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const deleteCartItem = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.delete("/deleteCartItem", { data })
            return res.data
        }
    })
}