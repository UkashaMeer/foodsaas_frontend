import { jwtDecode } from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid';
import { deleteCartItem } from '@/api/cart/deleteCartItem';
import { toast } from 'sonner';
import { Plus, Minus, Trash2, X } from "lucide-react"
import { updateCartItem } from '@/api/cart/updateCartItem';

export const CartItemCard = ({ item, setData }) => {
    const { mutate } = deleteCartItem()
    const { mutate: updateCart } = updateCartItem()
    const { itemId, quantity, selectedAddons, subtotal } = item
    const basePrice = itemId.isOnDiscount ? itemId.discountPrice : itemId.price

    const activeAddons = selectedAddons.filter(addon =>
        addon.categoryName && addon.options && addon.options.length > 0
    )

    const handleUpdateCartItem = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return

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
            guestId: guestId,
            cartItemId: cartItemId,
            quantity: newQuantity
        }

        updateCart(payload, {
            onSuccess: () => {
                setData((prev) => ({
                    ...prev,
                    cartItems: prev.cartItems.map((i) => {
                        if (i._id === cartItemId) {
                            const basePrice = i.itemId.isOnDiscount
                                ? i.itemId.discountPrice
                                : i.itemId.price;

                            const addonTotal = i.selectedAddons
                                .flatMap((a) => a.options)
                                .reduce((sum, opt) => sum + (opt.price || 0), 0);

                            const newSubtotal = (basePrice + addonTotal) * newQuantity;

                            return { ...i, quantity: newQuantity, subtotal: newSubtotal };
                        }
                        return i;
                    }),
                }));
            },
            onError: () => {
                console.error("Something went wrong")
            }
        })

    }

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

        const payload = {
            userId: userId,
            guestId: guestId,
            cartItemId: cartItemId
        }

        mutate(payload, {
            onSuccess: () => {
                setData((prev) => ({
                    ...prev,
                    cartItems: prev.cartItems.filter(i => i._id !== cartItemId)
                }))
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
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
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

                    {/* Quantity Controls + Final Price */}
                    <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center bg-muted rounded-lg">
                            <button className="p-2 hover:bg-muted-foreground/10 rounded-l-lg transition-colors cursor-pointer" onClick={() => handleUpdateCartItem(item._id, quantity - 1)}>
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-semibold text-sm min-w-[2.5rem] text-center ">
                                {quantity}
                            </span>
                            <button className="p-2 hover:bg-muted-foreground/10 rounded-r-lg transition-colors cursor-pointer" onClick={() => handleUpdateCartItem(item._id, quantity + 1)}>
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Price Summary */}
                        <div className="text-right">
                            {/* Show base + addon summary */}
                            {activeAddons.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Includes addons&nbsp;
                                    (
                                    {activeAddons
                                        .flatMap((addon) => addon.options)
                                        .reduce((sum, opt) => sum + (opt.price || 0), 0)
                                        .toLocaleString()}
                                    )
                                </p>
                            )}

                            {/* Final total for this item */}
                            <div className="text-base font-bold text-primary">
                                Rs. {subtotal.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}