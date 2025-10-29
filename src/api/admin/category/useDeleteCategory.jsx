import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useDeleteCategory = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosClient.delete(`/admin/category/${id}`)
            return res.data
        }
    })
}