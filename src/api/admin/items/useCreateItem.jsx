import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useCreateItem = () => {
    return useMutation({
        mutationFn: async ({ payload, file }) => {
            const formData = new FormData()

            Object.entries(payload).forEach(([key, value]) => {
                if (key === 'addons') {
                    // Stringify the nested addons array
                    formData.append(key, JSON.stringify(value))
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value.toString())
                }
            })

            if (file) {
                formData.append("images", file)
            }

            const res = await axiosClient.post("/admin/item", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })

            return res.data
        }
    })
}