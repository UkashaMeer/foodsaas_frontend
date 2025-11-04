import axiosClient from "@/lib/axiosClient"

export const useGetAllOrders = async () => {
    const res = await axiosClient("/get-all-orders")
    return res.data
}