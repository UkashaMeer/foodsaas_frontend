import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ChevronRight, Package, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export const OrderItemCard = ({ item, index }) => {
  const product = item.itemId
  const totalAddonPrice = item.selectedAddons?.reduce(
    (sum, addon) => sum + addon.options.reduce((a, opt) => a + opt.price, 0),
    0
  ) || 0

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm",
        "hover:border-primary/50 hover:shadow-lg hover:bg-card transition-all duration-500 transform",
        "border-l-4 border-l-primary/20 hover:border-l-primary",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-0"
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Product Image */}
      <div className="shrink-0 relative">
        {product?.images?.length > 0 ? (
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg border-2 group-hover:border-primary transition-colors shadow-sm"
            />
            {product?.isOnDiscount && (
              <div className="absolute -bottom-8 left-0">
                <Badge className="bg-primary text-white text-xs px-2 py-1 shadow-lg">
                  Discount
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg bg-linear-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground shadow-sm">
            <Package className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1 max-sm:text-sm">
                {product?.name || "Custom Item"}
              </h4>
              <span
                className="font-bold text-primary text-md max-sm:text-sm"
              >
                ×{item.quantity}
              </span>
            </div>
            {product?.details && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 group-hover:text-foreground/80 transition-colors max-sm:text-xs">
                {product.details}
              </p>
            )}
          </div>
          <div className="text-right ml-4">
            <p className="font-bold text-xl text-primary max-sm:text-sm">
              Rs. {item.subtotal.toLocaleString()}
            </p>
            {totalAddonPrice > 0 && (
              <p className="text-xs text-green-600 font-medium">
                +Rs. {totalAddonPrice} add-ons
              </p>
            )}
          </div>
        </div>

        {/* Addons */}
        {item.selectedAddons && item.selectedAddons.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Customizations
            </div>
            <div className="space-y-1">
              {item.selectedAddons.map((addon, addonIndex) => (
                <div
                  key={addonIndex}
                  className="flex items-center justify-between text-sm bg-primary/5 rounded-lg px-3 py-2 border border-primary/10 group-hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary max-sm:text-sm">
                      {addon.categoryName}
                    </span>
                    <ChevronRight className="h-3 w-3 text-primary/40" />
                    <span className="text-primary/80 max-sm:text-sm">
                      {addon.options.map(opt => opt.name).join(', ')}
                    </span>
                  </div>
                  {addon.options.some(opt => opt.price > 0) && (
                    <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded text-xs">
                      +Rs. {addon.options.reduce((sum, opt) => sum + opt.price, 0)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}