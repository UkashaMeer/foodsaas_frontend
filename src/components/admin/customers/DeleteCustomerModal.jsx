// app/admin/dashboard/customers/components/DeleteCustomerModal.jsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCustomerStore } from "@/store/useCustomerStore"
import { useState } from "react"
import { toast } from "sonner"

const DeleteCustomerModal = () => {
  const { selectedCustomer, deleteModalOpen, setDeleteModalOpen, setCustomers, customers } = useCustomerStore()
  const [isLoading, setIsLoading] = useState(false)

  if (!selectedCustomer) return null

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove customer from store
      const updatedCustomers = customers.filter(customer => customer._id !== selectedCustomer._id)
      setCustomers(updatedCustomers)
      
      toast.success("Customer deleted successfully")
      setDeleteModalOpen(false)
    } catch (error) {
      toast.error("Failed to delete customer")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedCustomer.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="font-medium">{selectedCustomer.name}</div>
            <div className="text-sm text-muted-foreground">{selectedCustomer.email}</div>
            <div className="text-sm text-muted-foreground">{selectedCustomer.phoneNumber}</div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Deleting..." : "Delete Customer"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDeleteModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteCustomerModal