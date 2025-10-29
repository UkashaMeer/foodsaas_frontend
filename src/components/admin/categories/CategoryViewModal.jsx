// components/admin/categories/CategoryViewModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function CategoryViewModal({ category, open, onOpenChange }) {
  if (!open || !category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div>
            <img
              src={category.images[0]}
              alt={category.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Name and Status */}
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-foreground">{category.name}</h4>
            <Badge variant={category.isActive ? "default" : "secondary"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Number of Items</Label>
              <p className="text-foreground font-semibold mt-1">{category.numberOfItems}</p>
            </div>
            <div>
              <Label>Created</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="border-t border-border pt-4">
            <Label className="text-base">Timeline</Label>
            <div className="space-y-2 text-sm mt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground">
                  {new Date(category.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-foreground">
                  {new Date(category.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}