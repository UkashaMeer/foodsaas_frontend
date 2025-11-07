import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CheckCircle2, Copy, Mail, MapPin, Phone, User } from "lucide-react"
import { useEffect, useState } from "react"

export const OrderCustomerInfoCard = ({ selectedOrder, copiedField, copyToClipboard }) => {
  const customerFields = [
    {
      icon: User,
      label: 'Customer Name',
      value: selectedOrder.fullName,
      field: 'customerName',
      color: 'text-primary'
    },
    {
      icon: Phone,
      label: 'Phone Number',
      value: selectedOrder.phoneNumber.toString(),
      field: 'phone',
      color: 'text-primary'
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: selectedOrder.email,
      field: 'email',
      color: 'text-primary'
    },
    {
      icon: MapPin,
      label: 'Delivery Address',
      value: `${selectedOrder.address}, ${selectedOrder.city}`,
      field: 'address',
      color: 'text-primary',
      isAddress: true
    }
  ]

  return (
    <Card className="mt-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-500 transform backdrop-blur-sm">
      <CardHeader className="p-0!">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 mx-0 p-0!">
        {customerFields.map((field, index) => {
          const FieldIcon = field.icon
          const [isVisible, setIsVisible] = useState(false)

          useEffect(() => {
            const timer = setTimeout(() => {
              setIsVisible(true)
            }, index * 150)
            return () => clearTimeout(timer)
          }, [index])

          return (
            <div
              key={field.field}
              className={cn(
                "flex items-center justify-between",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn("p-2 rounded-lg bg-primary/5", field.color)}>
                  <FieldIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{field.label}</p>
                  <p className={cn(
                    "text-sm mt-1",
                    field.isAddress ? "text-muted-foreground wrap-break-words" : "text-foreground font-mono"
                  )}>
                    {field.value}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 shrink-0"
                onClick={() => copyToClipboard(field.value, field.field)}
              >
                {copiedField === field.field ? (
                  <CheckCircle2 className="h-4 w-4 text-primary animate-pulse" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                )}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}