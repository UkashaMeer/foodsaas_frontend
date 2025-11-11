// app/admin/dashboard/customers/components/ViewCustomerModal.jsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCustomerStore } from "@/store/useCustomerStore"
import { Mail, Phone, Calendar, MapPin, CreditCard, ShoppingCart } from "lucide-react"
import { format } from "date-fns"

const ViewCustomerModal = () => {
  const { selectedCustomer, viewModalOpen, setViewModalOpen, openEditModal } = useCustomerStore()

  if (!selectedCustomer) return null

  return (
    <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
      <DialogContent style={{ width: "60vw", maxWidth: "none" }}>
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Complete information about {selectedCustomer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            {selectedCustomer.profilePicture ? (
              <img
                src={selectedCustomer.profilePicture}
                alt={selectedCustomer.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg font-medium">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={selectedCustomer.status === "ACTIVE" ? "default" : "secondary"}>
                  {selectedCustomer.status}
                </Badge>
                <Badge variant="outline">
                  {selectedCustomer.gender || 'Not specified'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.email}</span>
                  {selectedCustomer.isEmailVerified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.phoneNumber}</span>
                  {selectedCustomer.isPhoneVerified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Account Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {format(new Date(selectedCustomer.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Delivery Orders</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4 text-center">
              <div className="text-xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-xl font-bold text-green-600">PKR 45,670</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-xl font-bold text-blue-600">4.8</div>
              <div className="text-sm text-muted-foreground">Avg. Rating</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => {
                setViewModalOpen(false)
                openEditModal(selectedCustomer)
              }}
              className="flex-1"
            >
              Edit Customer
            </Button>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewCustomerModal