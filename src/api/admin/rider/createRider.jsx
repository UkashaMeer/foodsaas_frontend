import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const createRider = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosClient.post("/create-rider", payload)
            return res
        }
    })
}