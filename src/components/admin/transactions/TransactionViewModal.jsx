import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionStore } from "@/store/useTransactionStore";
import { 
  X, Copy, CheckCircle, Calendar, CreditCard, User, 
  Package, DollarSign, MapPin, Phone, Mail, ExternalLink,
  Shield, Receipt
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const DetailRow = ({ icon, label, value, copyable = false, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyable && value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm text-muted-foreground">{label}</p>
          <p 
            className={`text-foreground font-medium ${copyable ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
            onClick={handleCopy}
          >
            {value || 'N/A'}
          </p>
        </div>
      </div>
      {copyable && value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0 hover:bg-primary/10"
        >
          {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

const StatusPill = ({ status, type = "transaction" }) => {
  const statusConfig = {
    transaction: {
      completed: { label: "Completed", class: "bg-green-500 text-white" },
      pending: { label: "Pending", class: "bg-amber-500 text-white" },
      failed: { label: "Failed", class: "bg-red-500 text-white" }
    },
    order: {
      PENDING: { label: "Pending", class: "bg-amber-500 text-white" },
      ACCEPTED: { label: "Accepted", class: "bg-blue-500 text-white" },
      PREPARING: { label: "Preparing", class: "bg-purple-500 text-white" },
      ON_THE_WAY: { label: "On the Way", class: "bg-orange-500 text-white" },
      DELIVERED: { label: "Delivered", class: "bg-green-500 text-white" },
      CANCELLED: { label: "Cancelled", class: "bg-red-500 text-white" }
    }
  };

  const config = statusConfig[type][status] || statusConfig.transaction.pending;

  return (
    <Badge className={`${config.class} border-0 px-3 py-1 text-sm font-medium`}>
      {config.label}
    </Badge>
  );
};

export const TransactionViewModal = () => {
  const { selectedTransaction, isViewModalOpen, setIsViewModalOpen } = useTransactionStore();
  const [copiedField, setCopiedField] = useState(null);

  if (!selectedTransaction) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy • hh:mm a');
  };

  const copyToClipboard = async (text, field) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent" style={{
          width: window.innerWidth > 768 ? '90vw' : "100vw",
          maxWidth: 'none'
        }}>
        <div className="flex flex-col bg-background rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <DialogHeader className="relative p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-xl">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                    Transaction Details
                    <StatusPill status={selectedTransaction.status} />
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTransaction.orderId?.orderNumber}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => copyToClipboard(selectedTransaction._id, 'transactionId')}
                >
                  {copiedField === 'transactionId' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  Copy ID
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Transaction Details - TOP SECTION */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Transaction Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Amount Details */}
                    <div className="space-y-1">
                      <DetailRow
                        icon={<DollarSign className="h-4 w-4 text-primary" />}
                        label="Amount"
                        value={`PKR ${selectedTransaction.amount?.toLocaleString()}`}
                      />
                      {selectedTransaction.gatewayFee > 0 && (
                        <DetailRow
                          icon={<DollarSign className="h-4 w-4 text-primary" />}
                          label="Gateway Fee"
                          value={`PKR ${selectedTransaction.gatewayFee?.toLocaleString()}`}
                        />
                      )}
                      <DetailRow
                        icon={<DollarSign className="h-4 w-4 text-primary" />}
                        label="Net Amount"
                        value={`PKR ${selectedTransaction.netAmount?.toLocaleString()}`}
                      />
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-1">
                      <DetailRow
                        icon={<CreditCard className="h-4 w-4 text-primary" />}
                        label="Payment Method"
                        value={selectedTransaction.method?.toUpperCase()}
                      />
                      <DetailRow
                        icon={<Shield className="h-4 w-4 text-primary" />}
                        label="Currency"
                        value={selectedTransaction.currency}
                      />
                      {selectedTransaction.stripePaymentIntentId && (
                        <DetailRow
                          icon={<CreditCard className="h-4 w-4 text-primary" />}
                          label="Stripe Intent"
                          value={selectedTransaction.stripePaymentIntentId}
                          copyable
                        />
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="space-y-1">
                      <DetailRow
                        icon={<Calendar className="h-4 w-4 text-primary" />}
                        label="Created"
                        value={formatDate(selectedTransaction.createdAt)}
                      />
                      {selectedTransaction.paidAt && (
                        <DetailRow
                          icon={<CheckCircle className="h-4 w-4 text-primary" />}
                          label="Paid At"
                          value={formatDate(selectedTransaction.paidAt)}
                        />
                      )}
                      <DetailRow
                        icon={<Calendar className="h-4 w-4 text-primary" />}
                        label="Updated"
                        value={formatDate(selectedTransaction.updatedAt)}
                      />
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="border-t pt-4 mt-4">
                    <DetailRow
                      icon={<Receipt className="h-4 w-4 text-primary" />}
                      label="Transaction ID"
                      value={selectedTransaction._id}
                      copyable
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailRow
                      icon={<Mail className="h-4 w-4 text-primary" />}
                      label="Email"
                      value={selectedTransaction.userId?.email}
                      copyable
                    />
                    <DetailRow
                      icon={<Phone className="h-4 w-4 text-primary" />}
                      label="Phone"
                      value={selectedTransaction.userId?.phoneNumber}
                      copyable
                    />
                    <DetailRow
                      icon={<User className="h-4 w-4 text-primary" />}
                      label="User ID"
                      value={selectedTransaction.userId?._id}
                      copyable
                      className="md:col-span-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Order Details - BOTTOM SECTION */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-primary" />
                      Order Information
                    </CardTitle>
                    <StatusPill status={selectedTransaction.orderId?.status} type="order" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailRow
                      icon={<Package className="h-4 w-4 text-primary" />}
                      label="Order Number"
                      value={selectedTransaction.orderId?.orderNumber}
                      copyable
                    />
                    <DetailRow
                      icon={<DollarSign className="h-4 w-4 text-primary" />}
                      label="Order Total"
                      value={`PKR ${selectedTransaction.orderId?.totalPrice?.toLocaleString()}`}
                    />
                    <DetailRow
                      icon={<Calendar className="h-4 w-4 text-primary" />}
                      label="Order Created"
                      value={formatDate(selectedTransaction.orderId?.createdAt)}
                    />
                    <DetailRow
                      icon={<CreditCard className="h-4 w-4 text-primary" />}
                      label="Payment Method"
                      value={selectedTransaction.orderId?.paymentMethod?.toUpperCase()}
                    />
                  </div>

                  {/* Order Items */}
                  {selectedTransaction.orderId?.items && selectedTransaction.orderId.items.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-3">ORDER ITEMS</h4>
                      <div className="space-y-3">
                        {selectedTransaction.orderId.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                            {item.itemId?.images?.[0] && (
                              <img
                                src={item.itemId.images[0]}
                                alt={item.itemId.name}
                                className="h-16 w-16 rounded-lg object-cover border"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.itemId?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Item ID: {item.itemId?._id}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-primary/10 hover:text-primary"
                              onClick={() => copyToClipboard(item.itemId?._id, `item-${index}`)}
                            >
                              {copiedField === `item-${index}` ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Receipt className="h-5 w-5 text-primary" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {selectedTransaction.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};