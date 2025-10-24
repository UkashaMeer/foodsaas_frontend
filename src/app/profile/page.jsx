import EditProfile from '@/components/profile-page/EditProfile'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

export default function Profile() {
  return (
    <div className='max-w-[1140px] mx-auto px-4 py-10'>
        <Tabs className="flex flex-row">
            <TabsList defaultValue="details" className="flex flex-col">
                <TabsTrigger value='details'>My Details</TabsTrigger>
                <TabsTrigger value='orders'>My Orders</TabsTrigger>
                <TabsTrigger value='favourite'>My Favourite</TabsTrigger>
                <TabsTrigger value='address'>My Addresses</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
                <EditProfile />
            </TabsContent>
        </Tabs>
    </div>
  )
}
