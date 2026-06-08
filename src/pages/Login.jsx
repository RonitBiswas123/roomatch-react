import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { loginUser } from '../api'

function Login({ navigate, setUser }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')

  // Check for session expired message
  useEffect(() => {
    const expired = sessionStorage.getItem('session_expired')
    if (expired) {
      setApiError('Your session expired. Please login again.')
      sessionStorage.removeItem('session_expired')
    }
  }, [])

  const validate = () => {
    const e = {}
    if (!email)                    e.email    = 'Email is required'
    else if (!email.includes('@')) e.email    = 'Enter a valid email'
    if (!password)                 e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    setApiError('')

    try {
      const data = await loginUser({ email, password })
      setUser({ ...data.user }, data.access_token)
      navigate('dashboard')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} />
      <div className="flex justify-center items-center min-h-[85vh] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-7">Login to find your roommate</p>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-slate-200 focus:border-blue-500'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-colors ${errors.password ? 'border-red-400' : 'border-slate-200 focus:border-blue-500'}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            No account?{' '}
            <a onClick={() => navigate('register')} className="text-blue-600 font-semibold cursor-pointer">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login