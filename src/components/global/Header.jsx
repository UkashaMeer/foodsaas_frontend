"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LocationComponent from './headerComponents/LocationComponent'
import CartIcon from './headerComponents/cartIcon'
import UserLogin from './headerComponents/UserLogin'

export default function Header() {
    return (
        <header className='w-full shadow-sm border-b px-4 py-2'>
            <div className='max-w-[1140px] mx-auto flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className="logo">
                        <Link href="/">
                            <Image src="/logo.png" width={80} height={80} alt='logo' />
                        </Link>
                    </div>

                    {/* Location */}
                    <LocationComponent />
                </div>

                <div className='flex items-center gap-4'>
                    {/* Cart Icon */}
                    <CartIcon />

                    {/* user */}
                    <UserLogin />
                </div>
            </div>
        </header>
    )
}
