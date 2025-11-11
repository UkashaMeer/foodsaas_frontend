// app/admin/dashboard/customers/components/CustomerFilters.jsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download } from "lucide-react"
import { useCustomerStore } from "@/store/useCustomerStore"

const CustomerFilters = () => {
  const { searchTerm, statusFilter, setSearchTerm, setStatusFilter } = useCustomerStore()

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex flex-1 items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search customers by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  )
}

export default CustomerFilters