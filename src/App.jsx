import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [page, setPage] = useState('home')

  const navigate = (p) => setPage(p)

  if (page === 'login')    return <Login navigate={navigate} />
  if (page === 'register') return <Register navigate={navigate} />
  return <Home navigate={navigate} />
}

export default App