import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronDown, ChevronUp, CreditCard, Wallet, User, Package } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { format } from "date-fns";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { label: "Completed", class: "bg-green-500 hover:bg-green-600 text-white" },
    pending: { label: "Pending", class: "bg-amber-500 hover:bg-amber-600 text-white" },
    failed: { label: "Failed", class: "bg-red-500 hover:bg-red-600 text-white" }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={`${config.class} border-0`}>
      {config.label}
    </Badge>
  );
};

const PaymentMethodIcon = ({ method }) => {
  const icons = {
    card: <CreditCard className="h-4 w-4" />,
    wallet: <Wallet className="h-4 w-4" />,
    cash: <Wallet className="h-4 w-4" />
  };

  return (
    <div className="flex items-center gap-2">
      {icons[method] || <CreditCard className="h-4 w-4" />}
      <span className="capitalize">{method}</span>
    </div>
  );
};

export const TransactionTable = ({ transactions }) => {
  const { setSelectedTransaction, setIsViewModalOpen } = useTransactionStore();
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [sort, setSort] = useState({ field: 'createdAt', direction: 'desc' });

  const handleSort = (field) => {
    if (sort.field === field) {
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSort({ field, direction: 'desc' });
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const toggleExpandTransaction = (transactionId) => {
    setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId);
  };

  const SortableHeader = ({ field, children }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sort.field === field && (
          sort.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <SortableHeader field="createdAt">Date</SortableHeader>
            <TableHead>Customer</TableHead>
            <SortableHeader field="amount">Amount</SortableHeader>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <CreditCard className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No transactions found</p>
                  <p>Try adjusting your filters to find what you're looking for.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <>
                <TableRow key={transaction._id} className="hover:bg-muted/30 group">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold">{transaction.orderId?.orderNumber}</span>
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {transaction.description}
                      </span>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs justify-start"
                        onClick={() => toggleExpandTransaction(transaction._id)}
                      >
                        {expandedTransaction === transaction._id ? 'Hide' : 'Show'} details
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{format(new Date(transaction.createdAt), 'MMM dd, yyyy')}</span>
                      <span className="text-muted-foreground">
                        {format(new Date(transaction.createdAt), 'HH:mm')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">{transaction.userId?.email}</span>
                      <span className="text-sm">{transaction.userId?.phoneNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">
                        PKR {transaction.amount?.toLocaleString()}
                      </span>
                      {transaction.gatewayFee > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Fee: PKR {transaction.gatewayFee?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <PaymentMethodIcon method={transaction.method} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(transaction)}
                      className="flex items-center gap-2 transition-opacity border-primary/20 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                
                {/* Expanded Transaction Details */}
                {expandedTransaction === transaction._id && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted/20 p-0">
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Transaction Details */}
                          <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Transaction Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Transaction ID:</span>
                                <span className="font-mono">{transaction._id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Net Amount:</span>
                                <span className="font-semibold">PKR {transaction.netAmount?.toLocaleString()}</span>
                              </div>
                              {transaction.stripePaymentIntentId && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Stripe Intent:</span>
                                  <span className="font-mono text-xs">{transaction.stripePaymentIntentId}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Order Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Order Status:</span>
                                <Badge variant="outline" className="capitalize">
                                  {transaction.orderId?.status?.toLowerCase()}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Price:</span>
                                <span>PKR {transaction.orderId?.totalPrice?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Timeline
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{formatDate(transaction.createdAt)}</span>
                              </div>
                              {transaction.paidAt && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Paid At:</span>
                                  <span>{formatDate(transaction.paidAt)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Updated:</span>
                                <span>{formatDate(transaction.updatedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        {transaction.orderId?.items && transaction.orderId.items.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Order Items</h4>
                            <div className="space-y-2">
                              {transaction.orderId.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                                  {item.itemId?.images?.[0] && (
                                    <img
                                      src={item.itemId.images[0]}
                                      alt={item.itemId.name}
                                      className="h-12 w-12 rounded-lg object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">{item.itemId?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Item ID: {item.itemId?._id}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};