import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, User, Phone, Star, MapPin, Car, Clock, CheckCircle, Mail } from 'lucide-react'
import useOrderStore from '@/store/useOrderStore'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getOnlineRiders } from '@/api/rider/dashboard'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { assignOrderToRider } from '@/api/admin/orders/assignOrderToRider'
import { toast } from 'sonner'

export const AssignRiderDialog = () => {
  const { selectedOrder, isRiderDialogOpen, setRiderDialogOpen } = useOrderStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRider, setSelectedRider] = useState(null)
  const { mutate: assignOrder, isPending } = assignOrderToRider()

  const { data: ridersData, isLoading, error } = useQuery({
    queryFn: getOnlineRiders,
    queryKey: ["online-riders"]
  })

  console.log(ridersData)
  if (!selectedOrder) return null

  const riders = ridersData?.riders?.map(rider => ({
    _id: rider._id,
    name: rider.userId?.name,
    email: rider.userId?.email,
    phone: rider.userId?.phoneNumber,
    activeOrders: rider.assignedOrders?.length || 0,
    completedOrders: rider.deliveryStats?.completedOrders || 0,
    totalOrders: rider.deliveryStats?.totalOrders || 0,
    vehicleType: rider.vehicleType || 'BIKE',
    status: rider.status,
    accountStatus: rider.accountStatus,
    lastUpdated: rider.currentLocation?.lastUpdated,
    ordersAssignedToday: rider.ordersAssignedToday?.length || 0,
    ordersCompletedToday: rider.ordersCompletedToday?.length || 0
  })) || []

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.phone.includes(searchQuery) ||
    rider.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAssignRider = async () => {
    if (!selectedOrder) {
      toast.error('Please select an order to assign')
      return
    }

    const payload = {
      riderId: selectedRider._id,
      orderId: selectedOrder._id,
    }

    console.log(payload)

    assignOrder(payload, {
      onSuccess: (res) => {
        toast.success(`Order Assigned Successfully!`)
        setRiderDialogOpen(false)
      },
      onError: () => {
        toast.error('Failed to assign order. Please try again.')
      }
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'OFFLINE': return 'bg-gray-500'
      case 'BUSY': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'CAR': return '🚗'
      case 'BIKE': return '🏍️'
      case 'SCOOTER': return '🛵'
      case 'BICYCLE': return '🚲'
      default: return '🚗'
    }
  }

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <Dialog open={isRiderDialogOpen} onOpenChange={(open) => {
      setRiderDialogOpen(open)
      if (!open) {
        setSelectedRider(null)
        setSearchQuery('')
      }
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Assign Rider to Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col">
          {/* Order Info */}
          <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{selectedOrder.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.fullName} · {selectedOrder.phoneNumber}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {selectedOrder.city}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selectedOrder.address?.substring(0, 30)}...
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-[9px] h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search riders by name, phone, or vehicle type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Riders List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner className="h-8 w-8 text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Failed to load riders</p>
                <p className="text-sm">Please try again later</p>
              </div>
            ) : filteredRiders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No riders found matching your search.</p>
                <p className="text-sm">Try different search terms</p>
              </div>
            ) : (
              filteredRiders.map((rider) => (
                <div
                  key={rider._id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedRider?._id === rider._id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  onClick={() => setSelectedRider(rider)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Rider Avatar with Status */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-linear-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {getVehicleIcon(rider.vehicleType)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(rider.status)}`} />
                      </div>

                      {/* Rider Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-base">{rider.name}</p>
                          <Badge variant={rider.accountStatus === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
                            {rider.accountStatus}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {rider.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-primary" />
                            {rider.email}
                          </span>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            <span className="capitalize">{rider.vehicleType.toLowerCase()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{rider.activeOrders} active • {rider.ordersCompletedToday} today</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last seen: {formatTimeAgo(rider.lastUpdated)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedRider?._id === rider._id && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white ml-2">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selection Summary & Actions */}
          {selectedRider && (
            <div className="p-3 border border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Selected Rider:</p>
                  <p className="text-primary font-semibold">{selectedRider.name}</p>
                </div>
                <Badge variant="default" className="capitalize">
                  {selectedRider.vehicleType.toLowerCase()}
                </Badge>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setRiderDialogOpen(false)
                setSelectedRider(null)
                setSearchQuery('')
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedRider}
              onClick={handleAssignRider}
              size="lg"
            >
              {
                  selectedRider ? `Assign ${selectedRider.name}` : 'Select a Rider'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}