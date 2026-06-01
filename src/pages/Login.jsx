import { useState } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'

function Login({ navigate }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]     = useState({})

  const validate = () => {
    const newErrors = {}
    if (!email)                        newErrors.email    = 'Email is required'
    else if (!email.includes('@'))     newErrors.email    = 'Enter a valid email'
    if (!password)                     newErrors.password = 'Password is required'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    alert('Login coming on Day 15 with backend!')
  }

  return (
    <div>
      <Navbar navigate={navigate} />

      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="subtitle">Login to find your roommate</p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <Button text="Login" type="primary" fullWidth={true} submit={true} />

          </form>

          <div className="auth-link">
            No account?{' '}
            <a onClick={() => navigate('register')} style={{ cursor: 'pointer' }}>
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login