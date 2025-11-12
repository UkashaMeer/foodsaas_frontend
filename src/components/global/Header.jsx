// components/Header.jsx
"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LocationComponent from './headerComponents/LocationComponent'
import CartIcon from './headerComponents/CartIcon'
import UserLogin from './headerComponents/UserLogin'
import AddressPopup from './AddressPopup'

export default function Header() {
    return (
        <>
            <header className='w-full shadow-sm border-b px-3 sm:px-4 py-2 bg-background'>
                <div className='max-w-[1140px] mx-auto flex items-center justify-between gap-2 sm:gap-4'>
                    {/* Left Section - Logo & Location */}
                    <div className='flex items-center gap-2 sm:gap-4 flex-1 min-w-0'>
                        {/* Logo - Always visible */}
                        <div className="logo">
                            <Link href="/" className="block">
                                <Image 
                                    src="/logo.png" 
                                    width={60} 
                                    height={60} 
                                    alt='logo'
                                    className=""
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Location - Hidden on small mobile, visible from sm up */}
                        <div className="hidden sm:block flex-1 min-w-0">
                            <LocationComponent />
                        </div>
                    </div>

                    {/* Right Section - Cart & User */}
                    <div className='flex items-center gap-2 sm:gap-4'>
                        {/* Cart Icon - Always visible */}
                        <CartIcon />

                        {/* User Login - Always visible */}
                        <UserLogin />
                    </div>
                </div>

                {/* Mobile Location Bar - Only show on small screens */}
                <div className="sm:hidden mt-2 pt-2 border-t">
                    <LocationComponent />
                </div>
            </header>

            {/* Address Popup */}
            <AddressPopup />
        </>
    )
}