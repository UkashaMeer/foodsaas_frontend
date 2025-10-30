import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useItemStore } from "@/store/useItemStore";

export default function ItemCard({
  items,
  selectedItems,
  onSelectItem,
  onViewItem,
  onEditItem,
  onDeleteItem
}) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <ItemCardItem
          key={item._id}
          item={item}
          selected={selectedItems.includes(item._id)}
          onSelect={onSelectItem}
          onView={onViewItem}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
        />
      ))}
    </div>
  );
}

function ItemCardItem({ item, selected, onSelect, onView, onEdit, onDelete }) {
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

  const itemImage = item.images && item.images.length > 0 
    ? item.images[0] 
    : "/placeholder-food.jpg";

  const finalPrice = item.isOnDiscount && item.discountPrice ? item.discountPrice : item.price;

  return (
    <Card className={selected ? "ring-2 ring-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => onSelect(item._id, checked)}
              className="mt-1"
            />
            
            <div className="relative">
              <img
                className="h-16 w-16 rounded-lg object-cover shrink-0"
                src={itemImage}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "/placeholder-food.jpg";
                }}
              />
              {item.isOnDiscount && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="destructive" className="h-4 text-xs px-1">
                    Sale
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-medium text-foreground line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex flex-col items-end ml-2">
                  <span className={`font-semibold text-sm ${
                    item.isOnDiscount ? 'text-green-600' : 'text-foreground'
                  }`}>
                    Rs. {finalPrice}
                  </span>
                  {item.isOnDiscount && item.discountPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      Rs. {item.price}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {item.details}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge 
                  variant={item.isAvailable ? "default" : "secondary"}
                  className="text-xs cursor-pointer"
                  onClick={handleAvailabilityToggle}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </Badge>
                <Badge 
                  variant={item.isOnDiscount ? "default" : "outline"}
                  className="text-xs cursor-pointer"
                  onClick={handleDiscountToggle}
                >
                  {item.isOnDiscount ? "On Discount" : "No Discount"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.categoryName}
                </Badge>
              </div>

              {item.addons && item.addons.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {item.addons.length} addon{item.addons.length !== 1 ? 's' : ''} available
                </div>
              )}
            </div>
          </div>

          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="mt-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(item)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}