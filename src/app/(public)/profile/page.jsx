"use client"
import { useUser } from '@/api/user/auth/useUser'
import { useGetOrderByUserId } from '@/api/user/order/useGetOrderByUserId'
import EditProfile from '@/components/profile-page/EditProfile'
import MyOrders from '@/components/profile-page/MyOrders'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function Profile() {

  const [activeTab, setActiveTab] = useState("details")

  const { data: userData , isPending: userIsPending, isError: userIsError, error: userError } = useQuery({
    queryKey: ["users"],
    queryFn: useUser,
  })

  const { data: ordersData, isPending: orderIsPending, isError: orderIsError, error: orderError } = useQuery({
    queryKey: ["orders"],
    queryFn: useGetOrderByUserId,
    enabled: activeTab === "orders"
  })

  if (userIsError) toast.error("Something went wrong!" || userError)
  if (orderIsError) toast.error("Something went wrong!" || orderError)

  return (
    <div className='max-w-[1140px] mx-auto px-4 py-10'>
      <Tabs className="flex gap-6"  value={activeTab} onValueChange={setActiveTab} >
        <TabsList className="flex items-center gap-4">
          <TabsTrigger className="cursor-pointer p-4" value='details'>My Details</TabsTrigger>
          <TabsTrigger className="cursor-pointer p-4" value='orders'>My Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          {
            userIsPending ? <Spinner className="size-8 text-primary" /> : <EditProfile user={userData?.user} />
          }
        </TabsContent>
        <TabsContent value="orders">
          {
            orderIsPending ? <Spinner className="size-8 text-primary" /> : <MyOrders ordersData={ordersData} />
          }
        </TabsContent>
      </Tabs>
    </div>
  )
}
