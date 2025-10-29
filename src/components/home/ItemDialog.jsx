import { jwtDecode } from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid';
import React, { useMemo, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { X, Plus, Minus, ShoppingCart, Clock, Star } from 'lucide-react'
import { useAddToCart } from '@/api/user/cart/useAddToCart'
import { toast } from 'sonner';
import { useCartState } from '@/store/useCartState';


export default function ItemDialog({ item, open, setOpen }) {

    const { mutate, isPending } = useAddToCart()

    const {openCart} = useCartState()
    const [quantity, setQuantity] = useState(1)
    const [selectedAddons, setSelectedAddons] = useState({})

    const imageUrl = item?.images?.[0]
    const discountPercentage = item?.isOnDiscount
        ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
        : 0

    const toggleAddon = (addonId, optionId, addonName, maxSelectable) => {
        setSelectedAddons(prev => {
            const currentAddon = prev[addonId] || []
            const isSelected = currentAddon.includes(optionId)

            if (isSelected) {
                return {
                    ...prev,
                    [addonId]: currentAddon.filter(id => id !== optionId)
                }
            } else {
                if (maxSelectable === 1) {
                    return { ...prev, [addonId]: [optionId] }
                } else {
                    if (currentAddon.length < maxSelectable) {
                        return { ...prev, [addonId]: [...currentAddon, optionId] }
                    }
                    return prev
                }
            }
        })
    }

    const basePrice = item?.isOnDiscount ? item?.discountPrice : item?.price

    const total = useMemo(() => {
        let totalPrice = basePrice
        item?.addons?.forEach(addon => {
            const selected = selectedAddons[addon._id] || []
            selected.forEach(optionId => {
                const option = addon.options.find(opt => opt._id === optionId)
                if (option) {
                    totalPrice += option.discountPrice || option.price
                }
            })
        })
        return totalPrice * quantity
    }, [item, selectedAddons, quantity])

    if (!item) return null

    const handleAddToCart = async () => {
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

        const formattedAddons = Object.entries(selectedAddons).map(([addonId, optionIds]) => {
            const addon = item.addons.find(a => a._id === addonId);
            return {
                categoryName: addon?.name,
                options: addon?.options
                    .filter(opt => optionIds.includes(opt._id))
                    .map(opt => ({ name: opt.name, price: opt.discountPrice || opt.price }))
            };
        });

        const payload = {
            userId,
            guestId,
            itemId: item?._id,
            quantity,
            selectedAddons: formattedAddons
        }

        mutate(payload, ({
            onSuccess: (res) => {
                console.log(res)
                toast.success("Item added to the cart")
                setOpen(false)
                openCart()
            },
            onError: () => {
                toast.error("Something went wrong!")
            }
        }))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl w-full max-h-[90vh] p-0 gap-0 bg-white overflow-hidden flex flex-col">
                <div className="relative h-64 overflow-hidden group shrink-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 group/btn"
                    >
                        <X className="w-4 h-4 text-white group-hover/btn:rotate-90 transition-transform duration-300" />
                    </button>

                    {item.isOnDiscount && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-white font-semibold text-xs animate-pulse shadow-lg">
                            {discountPercentage}% OFF
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h2 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                            {item.name}
                        </h2>
                        <p className="text-white/90 text-xs drop-shadow-md">
                            {item.details}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            {item.averageRating && (
                                <div className="flex items-center gap-1 text-yellow-300">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-white text-xs font-medium">{item.averageRating}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {/* Price Section */}
                        <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                                    Rs. {item.isOnDiscount ? item.discountPrice : item.price}
                                </span>
                                {item.isOnDiscount && (
                                    <span className="text-base text-gray-400 line-through">
                                        Rs. {item.price}
                                    </span>
                                )}
                            </div>
                            {item.preparationTime && (
                                <div className="flex items-center gap-1 mt-1.5 text-gray-600">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-xs">{item.preparationTime} mins</span>
                                </div>
                            )}
                        </div>

                        {/* Addons Section */}
                        {item?.addons?.map((addon) => (
                            <div key={addon._id} className="mb-4 animate-fadeIn">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {addon.name}
                                        {addon.isRequired && (
                                            <span className="ml-1.5 text-xs text-red-500 font-normal">*Required</span>
                                        )}
                                    </h3>
                                    {
                                        addon.length > 0 && (
                                            <span className="text-xs text-gray-500">
                                                Select up to {addon.maxSelectable}</span>
                                        )
                                    }
                                </div>

                                <div className="space-y-2">
                                    {addon?.options?.map((option) => {
                                        const isSelected = selectedAddons[addon._id]?.includes(option._id)
                                        const isDisabled = !option.isAvailable

                                        return (
                                            <button
                                                key={option._id}
                                                onClick={() => !isDisabled && toggleAddon(addon._id, option._id, addon.name, addon.maxSelectable)}
                                                disabled={isDisabled}
                                                className={`w-full p-3 rounded-lg border-2 transition-all duration-300 ${isSelected
                                                    ? 'bg-opacity-10 shadow-sm scale-[1.01]'
                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                style={isSelected ? {
                                                    borderColor: 'var(--primary)',
                                                    backgroundColor: 'var(--primary)',
                                                } : {}}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-white' : 'border-gray-300'
                                                            }`}
                                                            style={isSelected ? { borderColor: 'white', backgroundColor: 'var(--primary)' } : {}}
                                                        >
                                                            {isSelected && (
                                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-scaleIn" />
                                                            )}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>{option.name}</p>
                                                            {isDisabled && (
                                                                <p className="text-xs text-red-500">Currently unavailable</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                                            +Rs. {option.discountPrice || option.price}
                                                        </span>
                                                        {option.discountPrice && (
                                                            <span className="ml-1.5 text-xs text-gray-400 line-through">
                                                                Rs. {option.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="border-t bg-gray-50 p-4 shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-white rounded-lg p-1.5 shadow-sm">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 cursor-pointer rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-semibold text-base">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 cursor-pointer rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <button
                            className="flex-1 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                            style={{ backgroundColor: 'var(--primary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">{isPending ? "Adding..." : "Add to Cart"}</span>
                            <span className="ml-auto text-sm font-bold">Rs. {total}</span>
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}