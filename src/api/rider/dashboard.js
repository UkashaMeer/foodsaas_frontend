import axiosClient from "@/lib/axiosClient"

export const getRiderDashboardStats = async (riderId) => {
    const res = await axiosClient.get(`/riders/dashboard-stats/${riderId}`)
    return res.data
}

export const getAvailableOrders = async (riderId) => {
    const res = await axiosClient.get(`/riders/available-orders/${riderId}`)
    return res.data
}

export const setRiderAvailability = async (data) => {
    const res = await axiosClient.put("/riders/set-availability", data)
    return res.data
}

// Accept an order
export const acceptOrder = async (data) => {
    const res = await axiosClient.post("/riders/accept-order", data)
    return res.data
}

// Get rider by user ID
export const getRiderByUserId = async (userId) => {
    const res = await axiosClient.get(`/riders/rider-by-user/${userId}`)
    return res.data
}

// Get assigned orders
export const getAssignedOrders = async (riderId) => {
    const res = await axiosClient.get(`/riders/assigned-orders/${riderId}`)
    return res.data
}

export const getRiderOrdersCompletedToday = async (riderId) => {
    const res = await axiosClient.get(`/riders/orders-completed-today/${riderId}`)
    return res.data
}

// Get order history
export const getOrderHistory = async (riderId, period = "all") => {
    const res = await axiosClient.get(`/riders/order-history/${riderId}?period=${period}`)
    return res.data
}

// Update order status
export const updateOrderStatus = async (data) => {
    const res = await axiosClient.put("/riders/update-order-status", data)
    return res.data
}

// Update rider location
export const updateRiderLocation = async (data) => {
    const res = await axiosClient.put("/riders/update-location", data)
    return res.data
}

// Update rider profile
export const updateRider = async (data) => {
    const res = await axiosClient.put("/riders/update-rider", data)
    return res.data
}