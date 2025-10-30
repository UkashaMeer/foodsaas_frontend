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
import { Badge } from "@/components/ui/badge";
import ItemRow from "./ItemRow";

export default function ItemsTable({
  items,
  selectedItems,
  onSelectAll,
  onSelectItem,
  onViewItem,
  onEditItem,
  onDeleteItem
}) {
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const indeterminate = selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <Card className="py-0!">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  className="ml-2"
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = indeterminate;
                    }
                  }}
                />
              </TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <ItemRow
                key={item._id}
                item={item}
                selected={selectedItems.includes(item._id)}
                onSelect={onSelectItem}
                onView={onViewItem}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}