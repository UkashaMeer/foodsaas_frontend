"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRiderStore } from "@/store/useRiderStore"
import { useUserLoginState } from "@/store/useUserLoginState"
import {
    getRiderDashboardStats,
    getAvailableOrders,
    setRiderAvailability,
    acceptOrder,
    getRiderByUserId,
    getAssignedOrders
} from "@/api/rider/dashboard"
import {
    Package,
    DollarSign,
    Clock,
    CheckCircle,
    Play,
    Pause,
    Navigation
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useRequireRider } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { getUserId } from "@/utils/auth"

export default function RiderDashboard() {
    const { userData } = useUserLoginState()
    const {
        rider,
        setRider,
        onlineStatus,
        setOnlineStatus,
        startTimer,
        stopTimer,
        resetTimer,
        dashboardStats,
        setDashboardStats,
        availableOrders,
        setAvailableOrders,
        setAssignedOrders
    } = useRiderStore()

    const { isRider } = useRequireRider('/rider/login')
    const userId = getUserId()
    const queryClient = useQueryClient()
    const router = useRouter()

    // Fetch rider data - Proper useEffect use karo
    const { data: getRiderByUserIdData, isLoading: getRiderByUserIdLoading } = useQuery({
        queryKey: ['get-rider', userId],
        queryFn: () => getRiderByUserId(userId),
        enabled: !!userId,
    })

    // useEffect use karo data set karne ke liye
    useEffect(() => {
        if (getRiderByUserIdData?.rider) {
            console.log("Setting rider data:", getRiderByUserIdData.rider)
            setRider(getRiderByUserIdData.rider)
            
            // Auto-start timer if rider is online in backend
            if (getRiderByUserIdData.rider.status === 'ONLINE') {
                startTimer()
            }
        }
    }, [getRiderByUserIdData, setRider, startTimer])

    const riderId = rider?._id

    // Fetch dashboard stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['rider-stats', riderId],
        queryFn: () => getRiderDashboardStats(riderId),
        enabled: !!riderId,
    })

    // Fetch available orders
    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['available-orders', riderId],
        queryFn: () => getAvailableOrders(riderId),
        enabled: !!riderId && onlineStatus === 'ONLINE',
        refetchInterval: 15000, // Refresh every 15 seconds
    })

    // Fetch assigned orders
    const { data: assignedOrdersData, isLoading: assignedOrdersLoading } = useQuery({
        queryKey: ['assigned-orders', riderId],
        queryFn: () => getAssignedOrders(riderId),
        enabled: !!riderId,
        refetchInterval: 10000, // Refresh every 10 seconds
    })

    // Update local state when data loads
    useEffect(() => {
        if (statsData) {
            console.log("Stats data:", statsData)
            setDashboardStats(statsData.stats)
        }
        if (ordersData) {
            console.log("Available orders:", ordersData)
            setAvailableOrders(ordersData.availableOrders || [])
        }
        if (assignedOrdersData) {
            console.log("Assigned orders:", assignedOrdersData)
            setAssignedOrders(assignedOrdersData.assignedOrders || [])
        }
    }, [statsData, ordersData, assignedOrdersData, setDashboardStats, setAvailableOrders, setAssignedOrders])

    // Toggle availability mutation
    const availabilityMutation = useMutation({
        mutationFn: setRiderAvailability,
        onSuccess: (data, variables) => {
            const newStatus = variables.status
            setOnlineStatus(newStatus)

            if (newStatus === 'ONLINE') {
                resetTimer()
                startTimer()
                toast.success("You're now online and ready to accept orders!")
            } else {
                stopTimer()
                toast.info("You're now offline")
            }

            // Refresh all relevant queries
            queryClient.invalidateQueries(['rider-stats'])
            queryClient.invalidateQueries(['available-orders'])
            queryClient.invalidateQueries(['assigned-orders'])
            queryClient.invalidateQueries(['get-rider'])
        },
        onError: (error) => {
            console.error("Availability update error:", error)
            toast.error("Failed to update availability")
        }
    })

    // Accept order mutation
    const acceptOrderMutation = useMutation({
        mutationFn: acceptOrder,
        onSuccess: () => {
            toast.success("Order accepted successfully!")
            // Refresh all data
            queryClient.invalidateQueries(['available-orders'])
            queryClient.invalidateQueries(['rider-stats'])
            queryClient.invalidateQueries(['assigned-orders'])
            queryClient.invalidateQueries(['get-rider'])

            // Redirect to assigned orders page
            setTimeout(() => {
                router.push('/rider/dashboard/assigned-orders')
            }, 1000)
        },
        onError: (error) => {
            console.error("Accept order error:", error)
            toast.error("Failed to accept order")
        }
    })

    const handleToggleAvailability = () => {
        if (!riderId) {
            toast.error("Rider information not loaded")
            return
        }

        const newStatus = onlineStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE'
        availabilityMutation.mutate({
            riderId,
            status: newStatus
        })
    }

    const handleAcceptOrder = (orderId) => {
        if (!riderId) {
            toast.error("Rider information not loaded")
            return
        }

        acceptOrderMutation.mutate({
            riderId,
            orderId
        })
    }

    const handleViewAssignedOrders = () => {
        router.push('/rider/dashboard/assigned-orders')
    }

    const formatCurrency = (amount) => {
        return `PKR ${amount?.toLocaleString() || '0'}`
    }

    // Check if rider has current order
    const hasCurrentOrder = rider?.currentOrder?.orderId

    // Debug logs
    console.log("Current state:", {
        riderId,
        rider,
        onlineStatus,
        dashboardStats,
        availableOrders: availableOrders?.length,
        assignedOrders: assignedOrdersData?.assignedOrders?.length,
        getRiderByUserIdData: getRiderByUserIdData
    })

    if (!isRider) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    if (getRiderByUserIdLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading rider information...</div>
            </div>
        )
    }

    if (!rider && getRiderByUserIdData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Setting up rider data...</div>
            </div>
        )
    }

    if (!rider) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-destructive">
                    Rider information not found. Please contact support.
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {userData?.name}! Manage your deliveries here.
                    </p>
                </div>

                <div className="flex gap-3">
                    {hasCurrentOrder && (
                        <Button
                            onClick={handleViewAssignedOrders}
                            variant="outline"
                            className="gap-2"
                        >
                            <Package className="h-4 w-4" />
                            View Current Order
                        </Button>
                    )}

                    <Button
                        onClick={handleToggleAvailability}
                        disabled={availabilityMutation.isLoading || hasCurrentOrder}
                        variant={onlineStatus === 'ONLINE' ? "destructive" : "default"}
                        className={cn(
                            "gap-2 min-w-[140px]",
                            onlineStatus === 'ONLINE' && "bg-green-600 hover:bg-green-700",
                            hasCurrentOrder && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {availabilityMutation.isLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : onlineStatus === 'ONLINE' ? (
                            <>
                                <Pause className="h-4 w-4" />
                                Go Offline
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4" />
                                Go Online
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Status Alert */}
            {hasCurrentOrder && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="font-medium text-yellow-800">
                                    You have an active order
                                </p>
                                <p className="text-sm text-yellow-700">
                                    Complete your current delivery before going offline
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardStats?.today?.earnings ? formatCurrency(dashboardStats.today.earnings) : 'PKR 0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {dashboardStats?.today?.orders || 0} orders delivered
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardStats?.week?.earnings ? formatCurrency(dashboardStats.week.earnings) : 'PKR 0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {dashboardStats?.week?.orders || 0} orders this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardStats?.overall?.completedOrders || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {dashboardStats?.overall?.cancelledOrders || 0} cancelled
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Status</CardTitle>
                        <Clock className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">
                            {rider?.status?.toLowerCase() || 'offline'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {hasCurrentOrder ? 'Currently delivering' : 'Ready to accept orders'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Available Orders & Quick Actions */}
            <Tabs defaultValue="available" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="available">Available Orders</TabsTrigger>
                    <TabsTrigger value="quick">Quick Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="space-y-4">
                    {onlineStatus !== 'ONLINE' ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground">
                                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Go online to see available orders</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : hasCurrentOrder ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground">
                                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Complete your current order to accept new ones</p>
                                    <Button
                                        onClick={handleViewAssignedOrders}
                                        variant="outline"
                                        className="mt-3"
                                    >
                                        View Current Order
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : ordersLoading ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">Loading available orders...</div>
                            </CardContent>
                        </Card>
                    ) : availableOrders.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No available orders at the moment</p>
                                    <p className="text-sm">New orders will appear here automatically</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {availableOrders.slice(0, 5).map((order) => (
                                <Card key={order._id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">#{order.orderNumber}</Badge>
                                                    <span className="font-medium">{order.userId?.name}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.items?.length} items • {formatCurrency(order.totalPrice)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    📍 {order.address}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => handleAcceptOrder(order._id)}
                                                disabled={acceptOrderMutation.isLoading}
                                                size="sm"
                                            >
                                                Accept Order
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="quick" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-6 text-center">
                                <Navigation className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h3 className="font-semibold">Update Location</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Refresh your current location
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={handleViewAssignedOrders}
                        >
                            <CardContent className="p-6 text-center">
                                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h3 className="font-semibold">View Assigned</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Check your current orders
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}