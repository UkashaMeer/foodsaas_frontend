import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useUpdateOrderStatus = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosClient.put("/update-order-status", payload)
            return res.data
        }
    })
}