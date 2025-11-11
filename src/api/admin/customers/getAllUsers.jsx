import axiosClient from "@/lib/axiosClient"

export const getAllUsers = async () => {
    const res = await axiosClient.get("/user/get-all-users")
    return res.data
}