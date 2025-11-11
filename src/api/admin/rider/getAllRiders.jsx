import axiosClient from "@/lib/axiosClient"

export const getAllRiders = async () => {
    const res = await axiosClient.get("/get-all-riders")
    return res.data
}