import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const usePlaceOrder = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/place-order", data)
            return res.data
        }
    })
}