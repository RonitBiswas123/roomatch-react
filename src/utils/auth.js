// ── Check if user is logged in ──
export const isLoggedIn = () => {
  const token   = localStorage.getItem('rm_token')
  const user    = localStorage.getItem('rm_user')
  const profile = localStorage.getItem('rm_profile')
  return !!(token && user)
}

// ── Check if profile is set up ──
export const hasProfile = () => {
  const profile = localStorage.getItem('rm_profile')
  return !!profile
}

// ── Get token ──
export const getToken = () => localStorage.getItem('rm_token')

// ── Get user ──
export const getUser = () => {
  const user = localStorage.getItem('rm_user')
  return user ? JSON.parse(user) : null
}

// ── Get profile ──
export const getProfile = () => {
  const profile = localStorage.getItem('rm_profile')
  return profile ? JSON.parse(profile) : null
}

// ── Clear all auth data ──
export const clearAuth = () => {
  localStorage.removeItem('rm_token')
  localStorage.removeItem('rm_user')
  localStorage.removeItem('rm_profile')
}

// ── Check if token is expired ──
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