// app/admin/dashboard/customers/page.jsx
"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "@/api/admin/customers/getAllUsers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCustomerStore } from "@/store/useCustomerStore"
import CustomerStats from "@/components/admin/customers/CustomerStats"
import CustomerFilters from "@/components/admin/customers/CustomerFilters"
import CustomersTable from "@/components/admin/customers/CustomersTable"
import Pagination from "@/components/admin/rider/Pagination"
import ViewCustomerModal from "@/components/admin/customers/ViewCustomerModal"
import EditCustomerModal from "@/components/admin/customers/EditCustomerModal"
import DeleteCustomerModal from "@/components/admin/customers/DeleteCustomerModal"

export default function CustomersPage() {
  const { data, error, isLoading } = useQuery({
    queryFn: getAllUsers,
    queryKey: ["customers"]
  })

  const { setCustomers, customers } = useCustomerStore()

  // Set customers data to store when API call succeeds
  useEffect(() => {
    if (data?.customers) {
      setCustomers(data.customers)
    }
  }, [data, setCustomers])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading customers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Error loading customers: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your restaurant customers and their information
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <CustomerStats />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            Search, filter and manage your customer database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CustomerFilters />
          <CustomersTable />
          <Pagination />
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewCustomerModal />
      <EditCustomerModal />
      <DeleteCustomerModal />
    </div>
  )
}