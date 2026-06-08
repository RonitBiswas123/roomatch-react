import { useEffect } from 'react'
import { isLoggedIn, isTokenExpired, clearAuth } from '../utils/auth'

function ProtectedRoute({ navigate, children, requireProfile = false, userProfile }) {

  useEffect(() => {
    // Check if token expired
    if (isTokenExpired()) {
      clearAuth()
      navigate('login')
      return
    }

    // Check if logged in
    if (!isLoggedIn()) {
      navigate('login')
      return
    }

    // Check if profile required
    if (requireProfile && !userProfile) {
      navigate('profile')
    }
  }, [])

  // If not logged in show nothing while redirecting
  if (!isLoggedIn() || isTokenExpired()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute