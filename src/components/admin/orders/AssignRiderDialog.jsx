import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, User, Phone, Star } from 'lucide-react'
import useOrderStore from '@/store/useOrderStore'
import { useState } from 'react'

// Mock riders data
const mockRiders = [
  { _id: '1', name: 'Ali Khan', phone: '0300-1234567', rating: 4.8, activeOrders: 2 },
  { _id: '2', name: 'Ahmed Raza', phone: '0300-7654321', rating: 4.6, activeOrders: 1 },
  { _id: '3', name: 'Usman Shah', phone: '0300-9876543', rating: 4.9, activeOrders: 0 },
  { _id: '4', name: 'Bilal Ahmed', phone: '0300-4567890', rating: 4.7, activeOrders: 3 },
]

export const AssignRiderDialog = () => {
  const { selectedOrder, isRiderDialogOpen, setRiderDialogOpen, assignRider } = useOrderStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRider, setSelectedRider] = useState(null)

  if (!selectedOrder) return null

  const filteredRiders = mockRiders.filter(rider =>
    rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.phone.includes(searchQuery)
  )

  const handleAssignRider = () => {
    if (selectedRider) {
      assignRider(selectedOrder._id, selectedRider._id)
      setRiderDialogOpen(false)
      setSelectedRider(null)
    }
  }

  return (
    <Dialog open={isRiderDialogOpen} onOpenChange={setRiderDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Rider to Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Order Info */}
          <div className="p-4 border rounded-lg bg-muted/20">
            <p className="font-medium">{selectedOrder.orderNumber}</p>
            <p className="text-sm text-muted-foreground">
              {selectedOrder.fullName} · {selectedOrder.city}
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search riders by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Riders List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredRiders.map((rider) => (
              <div
                key={rider._id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedRider?._id === rider._id
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedRider(rider)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{rider.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {rider.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {rider.rating}
                        </span>
                        <span>{rider.activeOrders} active orders</span>
                      </div>
                    </div>
                  </div>
                  {selectedRider?._id === rider._id && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            ))}
            
            {filteredRiders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No riders found matching your search.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setRiderDialogOpen(false)
                setSelectedRider(null)
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedRider}
              onClick={handleAssignRider}
            >
              Assign Rider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}