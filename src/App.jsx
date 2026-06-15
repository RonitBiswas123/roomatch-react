import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import Requests from './pages/Requests'
import Recommendations from './pages/Recommendations'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import { isTokenExpired, clearAuth, getUser, getProfile } from './utils/auth'

function App() {
  const [page,        setPage]        = useState('home')
  const [user,        setUser]        = useState(() => getUser())
  const [userProfile, setUserProfile] = useState(() => getProfile())

  const navigate = (p) => setPage(p)

  useEffect(() => {
    if (isTokenExpired()) {
      clearAuth()
      setUser(null)
      setUserProfile(null)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        clearAuth()
        setUser(null)
        setUserProfile(null)
        setPage('login')
      }
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSetUser = (u, token) => {
    setUser(u)
    localStorage.setItem('rm_user', JSON.stringify(u))
    if (token) localStorage.setItem('rm_token', token)
  }

  const handleSetProfile = (p) => {
    setUserProfile(p)
    localStorage.setItem('rm_profile', JSON.stringify(p))
  }

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    setUserProfile(null)
    setPage('home')
  }

  if (page === 'login') return (
    <GuestRoute navigate={navigate}>
      <Login navigate={navigate} setUser={handleSetUser} />
    </GuestRoute>
  )
  if (page === 'register') return (
    <GuestRoute navigate={navigate}>
      <Register navigate={navigate} setUser={handleSetUser} />
    </GuestRoute>
  )
  if (page === 'profile') return (
    <ProtectedRoute navigate={navigate} userProfile={userProfile}>
      <Profile navigate={navigate} user={user} setUserProfile={handleSetProfile} />
    </ProtectedRoute>
  )
  if (page === 'dashboard') return (
    <ProtectedRoute navigate={navigate} requireProfile={true} userProfile={userProfile}>
      <Dashboard navigate={navigate} userProfile={userProfile} onLogout={handleLogout} />
    </ProtectedRoute>
  )
  if (page === 'search') return (
    <ProtectedRoute navigate={navigate} userProfile={userProfile}>
      <Search navigate={navigate} userProfile={userProfile} onLogout={handleLogout} />
    </ProtectedRoute>
  )
  if (page === 'requests') return (
    <ProtectedRoute navigate={navigate} userProfile={userProfile}>
      <Requests navigate={navigate} userProfile={userProfile} onLogout={handleLogout} />
    </ProtectedRoute>
  )
  if (page === 'recommendations') return (
    <ProtectedRoute navigate={navigate} userProfile={userProfile}>
      <Recommendations navigate={navigate} userProfile={userProfile} onLogout={handleLogout} />
    </ProtectedRoute>
  )
  if (page === 'admin') return (
    <ProtectedRoute navigate={navigate} userProfile={userProfile}>
      <Admin navigate={navigate} userProfile={userProfile} onLogout={handleLogout} />
    </ProtectedRoute>
  )
  return <Home navigate={navigate} userProfile={userProfile} />
}

export default App