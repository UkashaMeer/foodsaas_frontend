import axiosClient from "@/lib/axiosClient"

export const useGetOrderByUserId = async () => {
    const res = await axiosClient.get("/get-order-by-user-id")
    return res.data
}