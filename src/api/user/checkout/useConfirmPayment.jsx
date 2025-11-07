import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useConfirmPayment = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/payment-confirm", data)
            return res.data
        }
    })
}