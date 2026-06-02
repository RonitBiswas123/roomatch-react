import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'

function App() {
  const [page, setPage] = useState('home')

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rm_user')
    return saved ? JSON.parse(saved) : null
  })

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('rm_profile')
    return saved ? JSON.parse(saved) : null
  })

  const navigate = (p) => setPage(p)

  const handleSetUser = (u) => {
    setUser(u)
    localStorage.setItem('rm_user', JSON.stringify(u))
  }

  const handleSetProfile = (p) => {
    setUserProfile(p)
    localStorage.setItem('rm_profile', JSON.stringify(p))
  }

  const handleLogout = () => {
    setUser(null)
    setUserProfile(null)
    localStorage.removeItem('rm_user')
    localStorage.removeItem('rm_profile')
    setPage('home')
  }

  if (page === 'login')     return <Login     navigate={navigate} setUser={handleSetUser} />
  if (page === 'register')  return <Register  navigate={navigate} setUser={handleSetUser} />
  if (page === 'profile')   return <Profile   navigate={navigate} user={user} setUserProfile={handleSetProfile} />
  if (page === 'dashboard') return <Dashboard navigate={navigate} userProfile={userProfile} onLogout={handleLogout} />
  return <Home navigate={navigate} userProfile={userProfile} />
}

export default App