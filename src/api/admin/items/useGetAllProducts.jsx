import axiosClient from "@/lib/axiosClient"

export const useGetAllProducts = async () => {
    const res = await axiosClient.get("/items")
    return res.data
}