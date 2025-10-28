import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: async ({payload, file}) => {
            const formData = new FormData()

            Object.entries(payload).forEach(([key, value]) => {
                formData.append(key, value)
            })

            if (file) {
                formData.append("profilePicture", file)
            }

            const res = await axiosClient.put("/user/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            })
            return res.data
        }
    })
}