import axiosClient from "@/lib/axiosClient"

export const useGetAllCategories = async () => {
    const res = await axiosClient.get("/category")
    
    return res.data
}