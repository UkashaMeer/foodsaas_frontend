import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useDeleteItem } from "@/api/admin/product/useDeleteItem";

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  item,
  selectedCount
}) {
  const isBulkDelete = selectedCount > 0;
  const itemName = item?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            {isBulkDelete ? (
              `Are you sure you want to delete ${selectedCount} selected item${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`
            ) : (
              `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
            )}
          </DialogDescription>
        </DialogHeader>

        {!isBulkDelete && item && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{item.categoryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">Rs. {item.price}</span>
              </div>
              {item.addons && item.addons.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Addons:</span>
                  <span className="font-medium">{item.addons.length}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1"
          >
            Delete{isBulkDelete ? ` ${selectedCount} Items` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}