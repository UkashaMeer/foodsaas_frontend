import { useState } from "react";
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

export default function CategoryRow({
  category,
  selected,
  onSelect,
  onView,
  onEdit,
  onDelete
}) {
  const handleDelete = () => {
    onDelete(category._id);
  };

  // Safe image access - agar images nahi hai toh default image use karein
  const categoryImage = category.images && category.images.length > 0 
    ? category.images[0] 
    : "https://avatar.iran.liara.run/public";

  return (
    <TableRow className={selected ? "bg-muted/50" : ""}>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(category._id, checked)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-lg object-cover"
            src={categoryImage}
            alt={category.name}
          />
          <div className="min-w-0">
            <div className="font-medium text-foreground">{category.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
              {category.description}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-foreground">
        {category.numberOfItems || 0}
      </TableCell>
      <TableCell>
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          {/* View Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-primary"
                  onClick={() => onView(category)}
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
                  className="h-8 w-8 p-0 hover:bg-green-50 hover:text-primary"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Category</p>
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
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-primary"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}