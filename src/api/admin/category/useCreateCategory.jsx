import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: async ({ payload, file }) => {
            const formData = new FormData()

            Object.entries(payload).forEach(([key, value]) => {
                formData.append(key, value)
            })

            if (file) {
                formData.append("images", file)
            }

            const res = await axiosClient.post("/admin/category", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })

            return res.data
        }
    })
}