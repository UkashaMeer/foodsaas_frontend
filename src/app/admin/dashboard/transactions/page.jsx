"use client"

import { getAllTransactions } from "@/api/admin/transactions/getAllTransactions"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TransactionStats } from "@/components/admin/transactions/TransactionStats";
import { TransactionFilters } from "@/components/admin/transactions/TransactionFilters";
import { TransactionTable } from "@/components/admin/transactions/TransactionTable";
import { TransactionPagination } from "@/components/admin/transactions/TransactionPagination";
import { TransactionViewModal } from "@/components/admin/transactions/TransactionViewModal";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function Transactions() {
  const { filters, getQueryParams } = useTransactionStore();

  const { data, isLoading, error } = useQuery({
    queryFn: () => getAllTransactions(getQueryParams()),
    queryKey: ["transactions", filters],
    keepPreviousData: true,
  })

  console.log(data)

   if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <Alert variant="destructive" className="max-w-7xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading transactions: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage and view all payment transactions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {!isLoading && data?.data?.summary && (
          <TransactionStats summary={data.data.summary} />
        )}

        {/* Filters */}
        <TransactionFilters />

        {/* Table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-4 sm:p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <TransactionTable transactions={data?.data?.transactions || []} />
          )}
        </div>

        {/* Pagination */}
        {!isLoading && data?.data && (
          <TransactionPagination 
            pagination={data.data}
          />
        )}

        {/* View Modal */}
        <TransactionViewModal />
      </div>
    </div>
  );
}