// components/admin/categories/CategoryCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function CategoryCard({
  categories,
  selectedCategories,
  onSelectCategory,
  onViewCategory,
  onEditCategory,
  onDeleteCategory
}) {
  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <CategoryCardItem
          key={category._id}
          category={category}
          selected={selectedCategories.includes(category._id)}
          onSelect={onSelectCategory}
          onView={onViewCategory}
          onEdit={onEditCategory}
          onDelete={onDeleteCategory}
        />
      ))}
    </div>
  );
}

function CategoryCardItem({ category, selected, onSelect, onView, onEdit, onDelete }) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      onDelete(category._id);
    }
  };

  return (
    <Card className={selected ? "ring-2 ring-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => onSelect(category._id, checked)}
              className="mt-1"
            />
            
            <img
              className="h-12 w-12 rounded-lg object-cover shrink-0"
              src={category.images[0]}
              alt={category.name}
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-foreground truncate">
                  {category.name}
                </h3>
                <Badge variant={category.isActive ? "default" : "secondary"} className="ml-2 shrink-0">
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {category.description}
              </p>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{category.numberOfItems} items</span>
                <span className="mx-2">•</span>
                <span>{new Date(category.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(category)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(category)}>
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