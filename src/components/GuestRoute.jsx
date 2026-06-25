import { useEffect, useState } from 'react'
import { isLoggedIn, isTokenExpired } from '../utils/auth'

function GuestRoute({ navigate, children }) {
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (isLoggedIn() && !isTokenExpired()) {
      navigate('dashboard')
    }
    setChecking(false)
  }, [])

  if (checking) return null

  if (isLoggedIn() && !isTokenExpired()) return null

  return children
}

export default GuestRoute