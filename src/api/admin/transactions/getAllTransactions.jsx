import axiosClient from "@/lib/axiosClient"

export const getAllTransactions = async (filters = {}) => {
    const {
        page = 1,
        limit = 20,
        status,
        method,
        userId,
        startDate,
        endDate
    } = filters;

    const params = new URLSearchParams({
        page,
        limit,
        ...(status && { status }),
        ...(method && { method }),
        ...(userId && { userId }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
    });
    const res = await axiosClient.get(`/transaction/get-all-transactions?${params}`)
    return res.data
}