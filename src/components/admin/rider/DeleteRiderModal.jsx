import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Ban } from 'lucide-react'
import { toast } from 'sonner'
import { deleteRider } from '@/api/admin/rider/deleteRider'

export default function DeleteRiderModal({ open, setOpen, rider }) {
  const [loading, setLoading] = useState(false)
  const { mutate } = deleteRider()

  const handleDelete = async () => {
    setLoading(true)

    const riderId = rider?._id
    console.log(riderId)
    mutate(riderId, {
      onSuccess: (res) => {
        toast.success(`Rider ${rider.userId.name} has been deleted successfully!`)
        setOpen(false)
        console.log(res)
      },
      onError: (err) => {
        toast.error("Something went wrong while deleting rider!")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Ban className="h-5 w-5" />
            Delete Rider
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">
              This action cannot be undone. This will permanently delete the rider account and all associated data.
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-2">Rider to be deleted:</h4>
            <p><strong>Name:</strong> {rider.userId.name}</p>
            <p><strong>Email:</strong> {rider.userId.email}</p>
            <p><strong>Phone:</strong> {rider.userId.phoneNumber}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Deleting..." : "Delete Rider"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}