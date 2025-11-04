// app/orders/page.jsx
"use client"

import { useGetAllOrders } from '@/api/admin/orders/useGetAllOrders'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import useOrderStore from '@/store/useOrderStore'
import OrderManagementPage from '@/components/admin/orders/OrderManagementPage'

export default function Orders() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: useGetAllOrders
  })

  const { setOrders, setLoading } = useOrderStore()

  // Yahan store set karo
  useEffect(() => {
    if (data?.orders) {
      setOrders(data.orders)
      setLoading(false)
    }
  }, [data, setOrders, setLoading])

  console.log(data)

  return (
    <OrderManagementPage />
  )
}