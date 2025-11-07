import { Button } from "@/components/ui/button";
import { useTransactionStore } from "@/store/useTransactionStore";

export const TransactionPagination = ({ pagination }) => {
  const { goToPage } = useTransactionStore();
  
  const { currentPage, totalPages, totalTransactions } = pagination;
  const page = parseInt(currentPage) || 1;
  const total = parseInt(totalPages) || 1;

  // Calculate showing range
  const startIndex = (page - 1) * 10 + 1; // Assuming default 10 items per page
  const endIndex = Math.min(page * 10, totalTransactions);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
      {/* Showing info */}
      <p className="text-sm text-muted-foreground">
        Showing {startIndex} to {endIndex} of {totalTransactions} items
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground mx-2">
          Page {page} of {total}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(Math.min(page + 1, total))}
          disabled={page === total}
        >
          Next
        </Button>
      </div>
    </div>
  );
};