import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const assignOrderToRider = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosClient.put("/assign-order-to-rider", payload)
            return res.data
        }
    })
}