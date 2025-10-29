// components/admin/categories/CategoriesTable.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import CategoryRow from "./CategoryRow";

export default function CategoriesTable({
  categories,
  selectedCategories,
  onSelectAll,
  onSelectCategory,
  onViewCategory,
  onEditCategory,
  onDeleteCategory
}) {
  const allSelected = categories.length > 0 && selectedCategories.length === categories.length;
  const indeterminate = selectedCategories.length > 0 && selectedCategories.length < categories.length;

  return (
    <Card className="py-0!">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = indeterminate;
                    }
                  }}
                />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                selected={selectedCategories.includes(category._id)}
                onSelect={onSelectCategory}
                onView={onViewCategory}
                onEdit={onEditCategory}
                onDelete={onDeleteCategory}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}