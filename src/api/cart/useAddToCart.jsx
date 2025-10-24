import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useAddToCart = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await axiosClient.post("/add-to-cart", data)
            return res.data
        }
    })
}