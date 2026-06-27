import { useState } from 'react'
import Navbar from '../components/Navbar'
import { registerUser } from '../api'

function Register({ navigate, setUser }) {
  const [form,     setForm]     = useState({ name: '', email: '', password: '', branch: '', year: '', gender: '' })
  const [errors,   setErrors]   = useState({})
  const [strength, setStrength] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')
  const [success,  setSuccess]  = useState(false)
  const [userName, setUserName] = useState('')

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'password') checkStrength(value)
  }

  const checkStrength = (val) => {
    if      (val.length === 0) setStrength('')
    else if (val.length < 6)   setStrength('weak')
    else if (val.length < 10)  setStrength('medium')
    else                       setStrength('strong')
  }

  const validate = () => {
    const e = {}
    if (!form.name || form.name.length < 3) e.name     = 'Name must be at least 3 characters'
    if (!form.email)                        e.email    = 'Email is required'
    else if (!form.email.includes('@'))     e.email    = 'Enter a valid email'
    if (!form.password)                     e.password = 'Password is required'
    else if (form.password.length < 6)      e.password = 'Minimum 6 characters'
    if (!form.branch)                       e.branch   = 'Please select your branch'
    if (!form.year)                         e.year     = 'Please select your year'
    if (!form.gender)                       e.gender   = 'Please select your gender'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    setApiError('')

    try {
      const data = await registerUser({
        name:     form.name,
        email:    form.email,
        password: form.password,
        branch:   form.branch,
        year:     parseInt(form.year),
        gender:   form.gender
      })
      setUserName(form.name)
      setUser({ ...data.user }, data.access_token)
      setSuccess(true)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-colors ${errors[field] ? 'border-red-400' : 'border-slate-200 focus:border-blue-500'}`

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar navigate={navigate} />
        <div className="flex justify-center items-center min-h-[85vh] px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">🎉 Welcome, {userName.split(' ')[0]}!</h2>
            <p className="text-slate-400 mb-8">Account created successfully. Now set up your profile to find roommates.</p>
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm"
              onClick={() => navigate('profile')}
            >
              Set Up Profile →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} />
      <div className="flex justify-center items-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h2>
          <p className="text-sm text-slate-400 mb-7">Join RoomMatch and find your perfect roommate</p>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
              <input type="text" placeholder="Rahul Sharma" value={form.name}
                onChange={(e) => update('name', e.target.value)} className={inputClass('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
              <input type="email" placeholder="you@college.edu" value={form.email}
                onChange={(e) => update('email', e.target.value)} className={inputClass('email')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => update('password', e.target.value)} className={inputClass('password')} />
              {strength === 'weak'   && <p className="text-red-500   text-xs mt-1">🔴 Too short</p>}
              {strength === 'medium' && <p className="text-yellow-500 text-xs mt-1">🟡 Medium</p>}
              {strength === 'strong' && <p className="text-green-500  text-xs mt-1">🟢 Strong</p>}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Branch</label>
              <select value={form.branch} onChange={(e) => update('branch', e.target.value)} className={inputClass('branch')}>
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
              </select>
              {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Year</label>
              <select value={form.year} onChange={(e) => update('year', e.target.value)} className={inputClass('year')}>
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
              <div className="flex gap-6 mt-1">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="radio" name="gender" value={g}
                      checked={form.gender === g}
                      onChange={(e) => update('gender', e.target.value)} />
                    {g}
                  </label>
                ))}
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>

          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <a onClick={() => navigate('login')} className="text-blue-600 font-semibold cursor-pointer">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register