import axiosClient from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const deleteRider = () => {
    return useMutation({
        mutationFn: async (riderId) => {
            console.log(riderId)
            const res = await axiosClient.delete("/delete-rider", {data: {riderId}})
            return res.data
        }
    })
}