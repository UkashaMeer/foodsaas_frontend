import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useDeleteItem = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosClient.delete(`/admin/item/${id}`)
            return res.data
        }
    })
}