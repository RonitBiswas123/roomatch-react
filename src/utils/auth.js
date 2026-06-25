export const isLoggedIn = () => {
  const token = localStorage.getItem('rm_token')
  const user  = localStorage.getItem('rm_user')
  return !!(token && user)
}

export const hasProfile = () => {
  const profile = localStorage.getItem('rm_profile')
  return !!profile
}

export const getToken   = () => localStorage.getItem('rm_token')
export const getUser    = () => {
  const user = localStorage.getItem('rm_user')
  return user ? JSON.parse(user) : null
}
export const getProfile = () => {
  const profile = localStorage.getItem('rm_profile')
  return profile ? JSON.parse(profile) : null
}
export const clearAuth  = () => {
  localStorage.removeItem('rm_token')
  localStorage.removeItem('rm_user')
  localStorage.removeItem('rm_profile')
}
export const isTokenExpired = () => {
  const token = getToken()
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now     = Math.floor(Date.now() / 1000)
    return payload.exp < now
  } catch {
    return true
  }
}