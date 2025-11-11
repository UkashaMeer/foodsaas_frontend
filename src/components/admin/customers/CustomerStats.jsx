// app/admin/dashboard/customers/components/CustomerStats.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, CreditCard, TrendingUp } from "lucide-react"
import { useCustomerStore } from "@/store/useCustomerStore"

const CustomerStats = () => {
  const { customers } = useCustomerStore()

  const stats = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: Users,
      description: "All registered customers",
      color: "text-blue-600"
    },
    {
      title: "Active Customers",
      value: customers.filter(c => c.status === "ACTIVE").length,
      icon: TrendingUp,
      description: "Currently active",
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: "1.2K", // You'll need to calculate this from orders data
      icon: ShoppingCart,
      description: "Lifetime orders",
      color: "text-orange-600"
    },
    {
      title: "Total Revenue",
      value: "PKR 245K", // You'll need to calculate this from orders data
      icon: CreditCard,
      description: "From all customers",
      color: "text-purple-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default CustomerStats