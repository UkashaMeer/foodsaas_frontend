"use client"

import { useGuestStore } from '@/store/useGuestStore'
import { useUserLoginState } from '@/store/useUserLoginState'
import { useEffect } from 'react'

export default function GuestInitializer() {
    const { initializeGuestId, initializeFromLocalStorage, clearGuestData } = useGuestStore()
    const { isLogin, checkLogin } = useUserLoginState()

    useEffect(() => {
        checkLogin()

        if (!isLogin) {
            initializeFromLocalStorage()
            initializeGuestId()
            console.log("🚀 Guest initialization complete")
        } else {
            clearGuestData()
            console.log("🚫 Guest data cleared - user is logged in")
        }
    }, [isLogin, checkLogin, initializeGuestId, initializeFromLocalStorage, clearGuestData])

    return null
}