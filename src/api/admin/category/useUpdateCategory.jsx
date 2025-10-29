import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useUpdateCategory = () => {
    return useMutation({
        mutationFn: async ({ id, payload, file }) => {
            const formData = new FormData()

            Object.entries(payload).forEach(([key, value]) => {
                formData.append(key, value)
            })

            if (file) {
                formData.append("images", file)
            }

            const res = await axiosClient.put(`/admin/category/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })

            return res.data
        }
    })
}