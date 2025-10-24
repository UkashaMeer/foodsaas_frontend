import axiosClient from "@/lib/axiosClient"

export const getItems = async () => {
    const res = await axiosClient.get("/items")
    return res.data
}