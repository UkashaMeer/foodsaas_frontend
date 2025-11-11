import axiosClient from "@/lib/axiosClient"

export const getAllPendingOrders = async () => {
    const res = await axiosClient.get("/get-all-pending-orders")
    return res.data
}