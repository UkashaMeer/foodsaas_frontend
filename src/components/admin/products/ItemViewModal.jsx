import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useItemStore } from "@/store/useItemStore";

export default function ItemViewModal({ item, open, onOpenChange, onEdit }) {
  const { setLightboxOpen, setSelectedItem } = useItemStore();

  if (!open || !item) return null;

  const itemImage = item.images && item.images.length > 0 
    ? item.images[0] 
    : "/placeholder-food.jpg";

  const finalPrice = item.isOnDiscount && item.discountPrice ? item.discountPrice : item.price;

  const handleImageClick = () => {
    setSelectedItem(item);
    setLightboxOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Item Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="text-center">
            <img
              src={itemImage}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleImageClick}
              onError={(e) => {
                e.target.src = "/placeholder-food.jpg";
              }}
            />
          </div>

          {/* Name and Status */}
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-foreground">{item.name}</h4>
            <div className="flex gap-2">
              <Badge variant={item.isAvailable ? "default" : "secondary"}>
                {item.isAvailable ? "Available" : "Unavailable"}
              </Badge>
              {item.isOnDiscount && (
                <Badge variant="destructive">On Discount</Badge>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <p className="text-sm text-muted-foreground mt-1">{item.categoryName}</p>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{item.details}</p>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Regular Price</Label>
              <p className="text-foreground font-semibold mt-1">Rs. {item.price}</p>
            </div>
            <div>
              <Label>Current Price</Label>
              <p className="text-green-600 font-semibold mt-1">Rs. {finalPrice}</p>
              {item.isOnDiscount && item.discountPrice && (
                <p className="text-xs text-muted-foreground">Discounted from Rs. {item.price}</p>
              )}
            </div>
          </div>

          {/* Addons */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <Label>Addons ({item.addons.length})</Label>
              <div className="mt-2 space-y-3">
                {item.addons.map((addon, index) => (
                  <div key={addon._id || index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">{addon.name}</span>
                      <div className="text-xs text-muted-foreground">
                        {addon.isRequired ? "Required" : "Optional"} • 
                        Max: {addon.maxSelectable}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {addon.options && addon.options.map((option, optIndex) => (
                        <div key={option._id || optIndex} className="flex justify-between text-sm">
                          <span>{option.name}</span>
                          <span className="text-muted-foreground">
                            Rs. {option.discountPrice || option.price}
                            {option.discountPrice && (
                              <span className="line-through text-xs ml-1">Rs. {option.price}</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => {
              onEdit(item);
              onOpenChange(false);
            }}>
              Edit Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}