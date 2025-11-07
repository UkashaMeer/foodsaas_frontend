import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserLoginState } from '@/store/useUserLoginState'
import { isAuthenticated, isOwner } from '@/utils/auth'

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

export const useRedirectIfAuthenticated = (redirectUrl = '/') => {
  const router = useRouter()
  const { isLogin, userRole, checkLogin } = useUserLoginState()

  useEffect(() => {
    checkLogin()
    if (isAuthenticated()) {
      if (userRole === 'OWNER' && redirectUrl === '/') {
        router.push('/admin/dashboard')
      } else {
        router.push(redirectUrl)
      }
    }
  }, [isLogin, userRole, router, redirectUrl, checkLogin])
}