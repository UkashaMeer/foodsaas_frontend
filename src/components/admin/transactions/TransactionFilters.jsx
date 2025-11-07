import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, X, CalendarIcon, CreditCard, Wallet } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/store/useTransactionStore";

const statusOptions = [
  { value: "completed", label: "Completed", color: "bg-green-500" },
  { value: "pending", label: "Pending", color: "bg-amber-500" },
  { value: "failed", label: "Failed", color: "bg-red-500" }
];

const paymentMethodOptions = [
  { value: "card", label: "Card", icon: CreditCard },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "cash", label: "Cash", icon: Wallet }
];

export const TransactionFilters = () => {
  const { filters, setFilters, resetFilters } = useTransactionStore();
  const [date, setDate] = useState({
    from: filters.startDate ? new Date(filters.startDate) : null,
    to: filters.endDate ? new Date(filters.endDate) : null,
  });

  const handleStatusToggle = (status) => {
    const newStatus = filters.status === status ? '' : status;
    setFilters({ status: newStatus, page: 1 });
  };

  const handlePaymentMethodToggle = (method) => {
    const newMethod = filters.paymentMethod === method ? '' : method;
    setFilters({ paymentMethod: newMethod, page: 1 });
  };

  const handleDateSelect = (range) => {
    setDate(range);
    setFilters({
      startDate: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
      endDate: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
      page: 1
    });
  };

  const handleSearch = (value) => {
    setFilters({ search: value, page: 1 });
  };

  const hasActiveFilters = 
    filters.status || 
    filters.paymentMethod || 
    filters.startDate || 
    filters.endDate || 
    filters.search;

  return (
    <div className="space-y-4">
      {/* Search and Clear Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order ID, email, phone, or description..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 border-2 focus:border-primary transition-colors"
          />
        </div>
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="flex items-center gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Status
              {filters.status && (
                <Badge variant="secondary" className="ml-1">
                  1
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <div 
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => handleStatusToggle('')}
              >
                <div className={cn(
                  "w-3 h-3 rounded-full border-2",
                  !filters.status ? "bg-primary border-primary" : "border-border"
                )} />
                <span className="text-sm">All Status</span>
              </div>
              {statusOptions.map((status) => (
                <div 
                  key={status.value}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleStatusToggle(status.value)}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2",
                    filters.status === status.value ? status.color + " border-" + status.color.split('-')[1] + "-500" : "border-border"
                  )} />
                  <span className="text-sm">{status.label}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Payment Method Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Payment Method
              {filters.paymentMethod && (
                <Badge variant="secondary" className="ml-1">
                  1
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <div 
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => handlePaymentMethodToggle('')}
              >
                <div className={cn(
                  "w-3 h-3 rounded-full border-2",
                  !filters.paymentMethod ? "bg-primary border-primary" : "border-border"
                )} />
                <span className="text-sm">All Methods</span>
              </div>
              {paymentMethodOptions.map((method) => {
                const Icon = method.icon;
                return (
                  <div 
                    key={method.value}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handlePaymentMethodToggle(method.value)}
                  >
                    <div className={cn(
                      "w-3 h-3 rounded-full border-2",
                      filters.paymentMethod === method.value ? "bg-primary border-primary" : "border-border"
                    )} />
                    <Icon className="h-4 w-4" />
                    <span className="text-sm capitalize">{method.label}</span>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusToggle(filters.status)}
              />
            </Badge>
          )}
          {filters.paymentMethod && (
            <Badge variant="secondary" className="flex items-center gap-1 capitalize">
              Method: {filters.paymentMethod}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handlePaymentMethodToggle(filters.paymentMethod)}
              />
            </Badge>
          )}
          {(filters.startDate || filters.endDate) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {filters.startDate && format(new Date(filters.startDate), "MMM dd, y")}
              {filters.endDate && ` - ${format(new Date(filters.endDate), "MMM dd, y")}`}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDateSelect({ from: null, to: null })}
              />
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleSearch('')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};