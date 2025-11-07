// components/transactions/TransactionStats.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, CreditCard, Wallet, TrendingUp } from "lucide-react";

export function TransactionStats({ summary }) {
  const stats = [
    {
      title: "Total Revenue",
      value: `Rs. ${summary.totalAmount?.toLocaleString() || 0}`,
      icon: IndianRupee,
      description: "All transactions",
      color: "text-green-600"
    },
    {
      title: "Total Transactions",
      value: summary.totalTransactions?.toLocaleString() || 0,
      icon: TrendingUp,
      description: "All payment methods",
      color: "text-blue-600"
    },
    {
      title: "Completed Revenue",
      value: `Rs. ${summary.completedAmount?.toLocaleString() || 0}`,
      icon: CreditCard,
      description: "Successful payments",
      color: "text-emerald-600"
    },
    {
      title: "Pending Revenue",
      value: `Rs. ${summary.pendingAmount?.toLocaleString() || 0}`,
      icon: Wallet,
      description: "Awaiting payment",
      color: "text-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}