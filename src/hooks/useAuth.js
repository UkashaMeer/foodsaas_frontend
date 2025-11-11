import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserLoginState } from '@/store/useUserLoginState'
import { isAuthenticated, isOwner, isRider, isCustomer } from '@/utils/auth'

export const useRequireAuth = (redirectUrl = '/') => {
  const router = useRouter()
  const { isLogin, checkLogin } = useUserLoginState()

  useEffect(() => {
    checkLogin()
    if (!isAuthenticated()) {
      router.push(redirectUrl)
    }
  }, [isLogin, router, redirectUrl, checkLogin])

  return { isAuthenticated: isLogin }
}

export const useRequireOwner = (redirectUrl = '/') => {
  const router = useRouter()
  const { isLogin, userRole, checkLogin } = useUserLoginState()

  useEffect(() => {
    checkLogin()
    if (!isAuthenticated() || userRole !== 'OWNER') {
      router.push(redirectUrl)
    }
  }, [isLogin, userRole, router, redirectUrl, checkLogin])

  return { isOwner: userRole === 'OWNER', isAuthenticated: isLogin }
}

export const useRequireRider = (redirectUrl = '/') => {
  const router = useRouter()
  const { isLogin, userRole, checkLogin } = useUserLoginState()

  useEffect(() => {
    checkLogin()
    if (!isAuthenticated() || userRole !== 'RIDER') {
      router.push(redirectUrl)
    }
  }, [isLogin, userRole, router, redirectUrl, checkLogin])

  return { isRider: userRole === 'RIDER', isAuthenticated: isLogin }
}

export const useRequireCustomer = (redirectUrl = '/') => {
  const router = useRouter()
  const { isLogin, userRole, checkLogin } = useUserLoginState()

  useEffect(() => {
    checkLogin()
    if (!isAuthenticated() || userRole !== 'CUSTOMER') {
      router.push(redirectUrl)
    }
  }, [isLogin, userRole, router, redirectUrl, checkLogin])

  return { isCustomer: userRole === 'CUSTOMER', isAuthenticated: isLogin }
}

export const useRedirectIfAuthenticated = (redirectUrl = '/') => {
  const router = useRouter()
  const { isLogin, userRole, checkLogin } = useUserLoginState()

  useEffect(() => {
    checkLogin()
    if (isAuthenticated()) {
      if (userRole === 'OWNER') {
        router.push('/admin/dashboard')
      } else if (userRole === 'RIDER') {
        router.push('/rider/dashboard')
      } else {
        router.push(redirectUrl)
      }
    }
  }, [isLogin, userRole, router, redirectUrl, checkLogin])
}

// Special hook for login pages to redirect based on role
export const useRedirectBasedOnRole = () => {
  const router = useRouter()
  const { isLogin, userRole, checkLogin } = useUserLoginState()

  useEffect(() => {
    checkLogin()
    if (isAuthenticated()) {
      if (userRole === 'OWNER') {
        router.push('/admin/dashboard')
      } else if (userRole === 'RIDER') {
        router.push('/rider/dashboard')
      } else {
        router.push('/')
      }
    }
  }, [isLogin, userRole, router, checkLogin])
}