import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useItemStore } from "@/store/useItemStore";

export default function ItemRow({
  item,
  selected,
  onSelect,
  onView,
  onEdit,
  onDelete
}) {
  const { toggleItemAvailability, toggleItemDiscount } = useItemStore();

  const handleDelete = () => {
    onDelete(item);
  };

  const handleAvailabilityToggle = () => {
    toggleItemAvailability(item._id);
  };

  const handleDiscountToggle = () => {
    toggleItemDiscount(item._id);
  };

  // Safe image access
  const itemImage = item.images && item.images.length > 0
    ? item.images[0]
    : "https://placehold.co/600x400";

  const finalPrice = item.isOnDiscount && item.discountPrice ? item.discountPrice : item.price;

  return (
    <TableRow className={`${selected ? "bg-muted/50" : ""}`}>
      <TableCell>
        <Checkbox
          className="ml-2"
          checked={selected}
          onCheckedChange={(checked) => onSelect(item._id, checked)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              className="h-12 w-12 rounded-lg object-cover"
              src={itemImage}
              alt={item.name}
              onError={(e) => {
                e.target.src = "/placeholder-food.jpg";
              }}
            />
            {item.isOnDiscount && (
              <div className="absolute -top-1 -right-1">
                <Badge variant="destructive" className="h-5 text-xs">
                  Sale
                </Badge>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-foreground truncate">{item.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
              {item.details}
            </div>
            {item.addons && item.addons.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {item.addons.length} addon{item.addons.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-foreground">
        {item.categoryName}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className={`font-semibold ${item.isOnDiscount ? 'text-green-600' : 'text-foreground'
            }`}>
            Rs. {finalPrice}
          </span>
          {item.isOnDiscount && item.discountPrice && (
            <span className="text-sm text-muted-foreground line-through">
              Rs. {item.price}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={item.isAvailable ? "default" : "secondary"}
          className="cursor-pointer hover:opacity-80"
          onClick={handleAvailabilityToggle}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={item.isOnDiscount ? "default" : "outline"}
          className="cursor-pointer hover:opacity-80"
          onClick={handleDiscountToggle}
        >
          {item.isOnDiscount ? "On Discount" : "No Discount"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          {/* View Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
                  onClick={() => onView(item)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Edit Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Delete Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}