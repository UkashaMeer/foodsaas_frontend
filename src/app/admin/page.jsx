"use client"

import { Spinner } from '@/components/ui/spinner'
import { useUserLoginState } from '@/store/useUserLoginState'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Admin() {
  const { checkLogin, isLogin } = useUserLoginState()
  const router = useRouter()

  useEffect(() => {
    if (isLogin) {
      router.push("/admin/dashboard")
    }else{
      router.push("/admin/login")
    }
  }, [checkLogin])

  return (
    <div className="w-full min-h-screen flex flex-col gap-2 items-center justify-center">
      <Spinner className="size-8 text-primary" />
      <span className="text-primary text-lg font-semibold">Loading...</span>
    </div>
  )
}
