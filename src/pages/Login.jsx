import { useState } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'

function Login({ navigate, setUser }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [errors,   setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!email)                    e.email    = 'Email is required'
    else if (!email.includes('@')) e.email    = 'Enter a valid email'
    if (!password)                 e.password = 'Password is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    alert('Login coming on Day 15 with backend!')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} />
      <div className="flex justify-center items-center min-h-[85vh] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-7">Login to find your roommate</p>

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

            <Button text="Login" type="primary" fullWidth={true} submit={true} />
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