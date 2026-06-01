import { useState } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'

function Register({ navigate }) {
  const [form, setForm]         = useState({ name: '', email: '', password: '', branch: '', year: '', gender: '' })
  const [errors, setErrors]     = useState({})
  const [strength, setStrength] = useState('')
  const [success, setSuccess]   = useState(false)

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'password') checkStrength(value)
  }

  const checkStrength = (val) => {
    if      (val.length === 0)  setStrength('')
    else if (val.length < 6)    setStrength('weak')
    else if (val.length < 10)   setStrength('medium')
    else                        setStrength('strong')
  }

  const validate = () => {
    const e = {}
    if (!form.name     || form.name.length < 3)  e.name     = 'Name must be at least 3 characters'
    if (!form.email)                              e.email    = 'Email is required'
    else if (!form.email.includes('@'))           e.email    = 'Enter a valid email'
    if (!form.password)                           e.password = 'Password is required'
    else if (form.password.length < 6)            e.password = 'Minimum 6 characters'
    if (!form.branch)                             e.branch   = 'Please select your branch'
    if (!form.year)                               e.year     = 'Please select your year'
    if (!form.gender)                             e.gender   = 'Please select your gender'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    console.log('Registered user:', form)
    setSuccess(true)
  }

  if (success) {
    return (
      <div>
        <Navbar navigate={navigate} />
        <div className="success-container">
          <div className="success-card">
            <h2>Registered!</h2>
            <p>Welcome, {form.name}! Your account has been created.</p>
            <Button
              text="Go to Login"
              type="primary"
              onClick={() => navigate('login')}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar navigate={navigate} />

      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="subtitle">Join RoomMatch and find your perfect roommate</p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className={errors.password ? 'input-error' : ''}
              />
              {strength && (
                <span className={`strength-msg strength-${strength}`}>
                  {strength === 'weak'   && '🔴 Too short'}
                  {strength === 'medium' && '🟡 Medium'}
                  {strength === 'strong' && '🟢 Strong'}
                </span>
              )}
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Branch</label>
              <select
                value={form.branch}
                onChange={(e) => update('branch', e.target.value)}
                className={errors.branch ? 'input-error' : ''}
              >
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
              </select>
              {errors.branch && <span className="error-msg">{errors.branch}</span>}
            </div>

            <div className="form-group">
              <label>Year</label>
              <select
                value={form.year}
                onChange={(e) => update('year', e.target.value)}
                className={errors.year ? 'input-error' : ''}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              {errors.year && <span className="error-msg">{errors.year}</span>}
            </div>

            <div className="form-group">
              <label>Gender</label>
              <div className="radio-group">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={(e) => update('gender', e.target.value)}
                    />
                    {g}
                  </label>
                ))}
              </div>
              {errors.gender && <span className="error-msg">{errors.gender}</span>}
            </div>

            <Button text="Register" type="primary" fullWidth={true} submit={true} />

          </form>

          <div className="auth-link">
            Already have an account?{' '}
            <a onClick={() => navigate('login')} style={{ cursor: 'pointer' }}>
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register