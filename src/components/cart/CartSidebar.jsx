import { jwtDecode } from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid';
import { getAllCartItems } from "@/api/cart/getAllCartItems"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useCartState } from "@/store/useCartState"
import { useEffect, useState } from "react"
import { ShoppingBag, X } from "lucide-react"
import { CartItemCard } from './CartItemCard';


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
                        <div>
                            <SheetClose>
                                <X />
                            </SheetClose>
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
                                <CartItemCard key={item._id} item={item} setData={setData} />
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
                            <button className="w-full bg-primary text-primary-foreground rounded-lg py-3.5 font-semibold text-base hover:bg-primary/90 transition-colors shadow-md cursor-pointer">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

