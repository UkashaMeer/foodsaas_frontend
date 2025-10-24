import { jwtDecode } from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid';
import { getAllCartItems } from "@/api/cart/getAllCartItems"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useCartState } from "@/store/useCartState"
import { useEffect, useState } from "react"
import { ShoppingBag, Plus, Minus, Trash2, X } from "lucide-react"
import { deleteCartItem } from '@/api/cart/deleteCartItem';
import { toast } from 'sonner';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

export default function CartSidebar() {
    const { mutate, isPending } = getAllCartItems()
    const { showCart, closeCart, setCount } = useCartState()
    const [data, setData] = useState(null)

    useEffect(() => {

        let userId = null
        let guestId = null

        const token = typeof window !== "undefined" && localStorage.getItem("token")

        if (token) {
            try {
                const decoded = jwtDecode(token)
                userId = decoded?._id
                localStorage.removeItem("guestId")
            } catch (err) {
                console.error("JWT Decode Error: ", err)
            }
        } else {
            guestId = localStorage.getItem("guestId")
            if (!guestId) {
                guestId = uuidv4()
                localStorage.setItem("guestId", guestId)
            }
        }

        const payload = {
            userId: userId,
            guestId: guestId
        }

        mutate(payload, {
            onSuccess: (res) => {
                setData(res)
            },
            onError: () => {
                console.error("Something went wrong")
            }
        })

    }, [showCart])

    const cartItems = data?.cartItems || []
    const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    useEffect(() => {
        setCount(itemCount)
    }, [itemCount])


    return (
        <Sheet open={showCart} onOpenChange={(val) => {
            if (!val) closeCart()
        }}>
            <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
                {/* Header */}
                <SheetHeader className="px-6 py-5 border-b border-border bg-background sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <SheetTitle className="text-xl font-semibold">Your Cart</SheetTitle>
                                <p className="text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto">
                    {isPending ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                            <p className="text-sm text-muted-foreground mb-6">Add items to get started</p>
                        </div>
                    ) : (
                        <div className="px-4 py-4 space-y-4">
                            {cartItems.map((item) => (
                                <CartItemCard key={item._id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-border bg-background sticky bottom-0 z-10">
                        <div className="px-6 py-4 space-y-3">
                            {/* Subtotal */}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">Rs. {totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <span className="font-medium">Rs. 0</span>
                            </div>
                            <div className="h-px bg-border"></div>

                            {/* Total */}
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-2xl font-bold text-primary">Rs. {totalAmount.toLocaleString()}</span>
                            </div>

                            {/* Checkout Button */}
                            <button className="w-full bg-primary text-primary-foreground rounded-lg py-3.5 font-semibold text-base hover:bg-primary/90 transition-colors shadow-md">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

function CartItemCard({ item }) {
    const { mutate, isPending } = deleteCartItem()
    const { itemId, quantity, selectedAddons, subtotal } = item
    const basePrice = itemId.isOnDiscount ? itemId.discountPrice : itemId.price
    const queryClient = useQueryClient()
    
    const activeAddons = selectedAddons.filter(addon =>
        addon.categoryName && addon.options && addon.options.length > 0
    )

        const handleDeleteCartItem = (cartItemId) => {
            let userId = null
            let guestId = null

            const token = typeof window !== "undefined" && localStorage.getItem("token")

            if (token) {
                try {
                    const decoded = jwtDecode(token)
                    userId = decoded?._id
                    localStorage.removeItem("guestId")
                } catch (err) {
                    console.error("JWT Decode Error: ", err)
                }
            } else {
                guestId = localStorage.getItem("guestId")
                if (!guestId) {
                    guestId = uuidv4()
                    localStorage.setItem("guestId", guestId)
                }
            }

            console.log(userId)

            const payload = {
                userId: userId,
                guestId: guestId,
                cartItemId: cartItemId
            }

            console.log(payload)

            mutate(payload, {
                onSuccess: () => {
                    toast.success("Item Removed Successfully.")
                    queryClient.invalidateQueries(["cartItems"])
                },
                onError: () => {
                    console.error("Something went wrong")
                }
            })
    }

    return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                {/* Image */}
                <div className="relative shrink-0">
                    <img
                        src={itemId.images[0]}
                        alt={itemId.name}
                        className="w-24 h-24 object-cover rounded-lg"
                    />
                    {itemId.isOnDiscount && (
                        <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            {Math.round((1 - itemId.discountPrice / itemId.price) * 100)}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                            <h3 className="font-semibold text-base line-clamp-1 mb-1">{itemId.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary">Rs. {basePrice}</span>
                                {itemId.isOnDiscount && (
                                    <span className="text-sm text-muted-foreground line-through">Rs. {itemId.price}</span>
                                )}
                            </div>
                        </div>
                        <button className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer" onClick={() => handleDeleteCartItem(item._id)}>
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Addons */}
                    {activeAddons.length > 0 && (
                        <div className="mb-3 space-y-1">
                            {activeAddons.map((addon) => (
                                <div key={addon._id} className="text-xs text-muted-foreground">
                                    <span className="font-medium">{addon.categoryName}:</span>{' '}
                                    {addon.options.map((opt, idx) => (
                                        <span key={opt._id}>
                                            {opt.name} (+Rs. {opt.price})
                                            {idx < addon.options.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center bg-muted rounded-lg">
                            <button className="p-2 hover:bg-muted-foreground/10 rounded-l-lg transition-colors">
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-semibold text-sm min-w-[2.5rem] text-center">{quantity}</span>
                            <button className="p-2 hover:bg-muted-foreground/10 rounded-r-lg transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold">Rs. {subtotal.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}