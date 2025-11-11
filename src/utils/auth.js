export const decodeToken = (token) => {
  try {
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (error) {
    console.error('Token decode error:', error)
    return null
  }
}

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Token save karte time cookies mein bhi save karein
export const saveToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
    // Cookie mein bhi save karein for middleware access
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
  }
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    // Cookie ko bhi remove karein
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export const getTokenFromCookie = () => {
  if (typeof window !== 'undefined') {
    const value = `; ${document.cookie}`
    const parts = value.split(`; token=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
  return null
}

export const isAuthenticated = () => {
  return !!getToken()
}

export const isOwner = () => {
  const token = getToken()
  if (!token) return false
  
  const payload = decodeToken(token)
  return payload?.role === 'OWNER'
}

export const isRider = () => {
  const token = getToken()
  if (!token) return false
  
  const payload = decodeToken(token)
  return payload?.role === 'RIDER'
}

export const isCustomer = () => {
  const token = getToken()
  if (!token) return false
  
  const payload = decodeToken(token)
  return payload?.role === 'CUSTOMER'
}

export const getUserRole = () => {
  const token = getToken()
  if (!token) return null
  
  const payload = decodeToken(token)
  return payload?.role
}

export const getUserId = () => {
  const token = getToken()
  if (!token) return null
  
  const payload = decodeToken(token)
  return payload?._id
}

export const getUserName = () => {
  const token = getToken()
  if (!token) return null
  
  const payload = decodeToken(token)
  return payload?.name
}