import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const updateRider = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosClient.put("/update-rider", payload)
            return res.data
        }
    })
}