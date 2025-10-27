import { useCartState } from "@/store/useCartState";
import { ShoppingBag } from "lucide-react";

export default function CartIcon() {

    const { openCart, count } = useCartState()

    return (
        <div className='bg-primary p-2 rounded-md relative' onClick={openCart}>
            {count > 0 && (
                <span className='absolute px-2 py-[3px] bg-primary rounded-sm top-[-40%] right-[-25%] z-10 block text-white text-xs border-white border'>
                    {count}
                </span>
            )}

            <ShoppingBag className='text-white cursor-pointer w-5 h-5' />
        </div>
    )
}
