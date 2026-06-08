import { useEffect } from 'react'
import { isLoggedIn, isTokenExpired } from '../utils/auth'

function GuestRoute({ navigate, children }) {

  useEffect(() => {
    if (isLoggedIn() && !isTokenExpired()) {
      navigate('dashboard')
    }
  }, [])

  // If already logged in show nothing while redirecting
  if (isLoggedIn() && !isTokenExpired()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    )
  }

  return children
}

export default GuestRoute