// app/admin/dashboard/customers/components/CustomersTable.jsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Mail, Phone } from "lucide-react"
import { useCustomerStore } from "@/store/useCustomerStore"
import { format } from "date-fns"

const CustomersTable = () => {
  const { 
    paginatedCustomers, 
    openViewModal, 
    openEditModal, 
    openDeleteModal 
  } = useCustomerStore()

  const getStatusVariant = (status) => {
    return status === "ACTIVE" ? "default" : "secondary"
  }

  const getVerificationBadge = (isVerified) => {
    return isVerified ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        Pending
      </Badge>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCustomers().map((customer) => (
            <TableRow key={customer._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {customer.profilePicture ? (
                    <img
                      src={customer.profilePicture}
                      alt={customer.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.gender?.toLowerCase() || 'Not specified'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{customer.phoneNumber}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(customer.status)}>
                  {customer.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {getVerificationBadge(customer.isEmailVerified)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openViewModal(customer)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditModal(customer)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => openDeleteModal(customer)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CustomersTable