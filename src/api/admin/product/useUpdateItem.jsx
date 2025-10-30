import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useUpdateItem = () => {
    return useMutation({
        mutationFn: async ({ id, payload, file }) => {
            const formData = new FormData()

            Object.entries(payload).forEach(([key, value]) => {
                if (key === 'addons') {
                    formData.append(key, JSON.stringify(value))
                } else if (value !== null && value !== undefined) {
                    if (typeof value === 'boolean') {
                        formData.append(key, value.toString())
                    } else {
                        formData.append(key, value)
                    }
                }
            })

            if (file) {
                formData.append("images", file)
            }

            const res = await axiosClient.put(`/admin/item/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })

            return res.data
        }
    })
}