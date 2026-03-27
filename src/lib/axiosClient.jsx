import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://foodsaas-backend-aoyrcg-0e6a59-151-243-3-122.traefik.me/api"
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default axiosClient
