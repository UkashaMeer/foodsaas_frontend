// components/headerComponents/CartIcon.jsx
"use client"

import { useCartState } from "@/store/useCartState";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartIcon() {
    const { openCart, count } = useCartState()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative h-9 w-9 sm:h-9 sm:w-9 rounded-lg bg-primary hover:bg-primary/90"
        >
            <ShoppingBag className='text-white w-4 h-4 sm:w-6 sm:h-6' />
            
            {count > 0 && (
                <span className='absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-destructive text-white text-xs rounded-full border-2 border-background flex items-center justify-center font-medium'>
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </Button>
    )
}