import axiosClient from "@/lib/axiosClient"

export const useUser = async () => {
    const res = await axiosClient.get("/user/profile")
    return res.data
}