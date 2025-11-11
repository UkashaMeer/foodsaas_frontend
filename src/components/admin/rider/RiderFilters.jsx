"use client"

import { useRidersStore } from '@/store/useRidersStore'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RiderFilters() {
  const { searchQuery, setSearchQuery, filters, setFilters } = useRidersStore()

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search Riders</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Status Filter */}
          <div className="space-y-2 w-full">
            <Label>Status</Label>
            <Select
              value={filters.isActive}
              onValueChange={(value) => setFilters({ isActive: value })}
            >
              <SelectTrigger  className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select
              value={filters.vehicleType}
              onValueChange={(value) => setFilters({ vehicleType: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="BIKE">Bike</SelectItem>
                <SelectItem value="SCOOTER">Scooter</SelectItem>
                <SelectItem value="CAR">Car</SelectItem>
                <SelectItem value="BICYCLE">Bicycle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Verification Status Filter */}
          <div className="space-y-2">
            <Label>Verification</Label>
            <Select
              value={filters.verificationStatus}
              onValueChange={(value) => setFilters({ verificationStatus: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Orders Filter */}
          <div className="space-y-2">
            <Label>Min Orders Completed</Label>
            <Select
              value={filters.minOrdersCompleted.toString()}
              onValueChange={(value) => setFilters({ minOrdersCompleted: parseInt(value) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="1">1+ Orders</SelectItem>
                <SelectItem value="5">5+ Orders</SelectItem>
                <SelectItem value="10">10+ Orders</SelectItem>
                <SelectItem value="20">20+ Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}