import { useState } from 'react'
import Navbar from '../components/Navbar'
import { createProfile, extractTraits } from '../api'

function Profile({ navigate, user, setUserProfile }) {

  if (!user) {
    navigate('login')
    return null
  }

  const [sleepTime,   setSleepTime]   = useState('')
  const [wakeTime,    setWakeTime]    = useState('')
  const [studyHours,  setStudyHours]  = useState('')
  const [cleanliness, setCleanliness] = useState('')
  const [noise,       setNoise]       = useState('')
  const [guests,      setGuests]      = useState('')
  const [about,       setAbout]       = useState('')
  const [aboutText,   setAboutText]   = useState('')
  const [aiTraits,    setAiTraits]    = useState([])
  const [extracting,  setExtracting]  = useState(false)
  const [errors,      setErrors]      = useState({})
  const [saved,       setSaved]       = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [apiError,    setApiError]    = useState('')

  const userName   = user.name
  const userBranch = user.branch
  const userYear   = user.year
  const initials   = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  const validate = () => {
    const e = {}
    if (!sleepTime)   e.sleepTime   = 'Please select sleep time'
    if (!wakeTime)    e.wakeTime    = 'Please select wake time'
    if (!studyHours)  e.studyHours  = 'Please select study hours'
    if (!cleanliness) e.cleanliness = 'Please select cleanliness level'
    if (!noise)       e.noise       = 'Please select noise preference'
    if (!guests)      e.guests      = 'Please select guest preference'
    return e
  }

  const handleExtractTraits = async () => {
    if (!aboutText || aboutText.trim().length < 10) {
      setApiError('Write at least 10 characters about yourself first')
      return
    }
    setExtracting(true)
    setApiError('')
    try {
      const data = await extractTraits(aboutText)
      setAiTraits(data.traits)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setExtracting(false)
    }
  }

  const removeTrait = (trait) => {
    setAiTraits(prev => prev.filter(t => t !== trait))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setLoading(true)
    setApiError('')
    try {
      await createProfile(user.id, {
        sleep_time:   sleepTime,
        wake_time:    wakeTime,
        study_hours:  studyHours,
        cleanliness:  cleanliness,
        noise:        noise,
        guests:       guests,
        about:        about,
        about_text:   aboutText,
        ai_traits:    aiTraits
      })
      const fullProfile = {
        ...user,
        sleepTime, wakeTime, studyHours,
        cleanliness, noise, guests, about,
        aboutText, aiTraits
      }
      setUserProfile(fullProfile)
      setSaved(true)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectClass = (field) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm outline-none bg-white transition-colors ${errors[field] ? 'border-red-400' : 'border-slate-200 focus:border-blue-500'}`

  if (saved) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar navigate={navigate} />
        <div className="flex justify-center items-center min-h-[85vh] px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Profile Saved! ✅</h2>
            <p className="text-slate-400 mb-4">Your profile is ready.</p>
            {aiTraits.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-2">AI detected your traits:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {aiTraits.map((trait, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 font-medium">
                      ✨ {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm"
              onClick={() => navigate('dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} />
      <div className="max-w-4xl mx-auto px-6 py-10 flex gap-8 items-start">

        <div className="flex-1 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Set Up Your Profile</h2>
          <p className="text-sm text-slate-400 mb-6">Tell us about your habits to find your perfect match</p>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {[
              { label: 'Usual Sleep Time',  value: sleepTime,   set: setSleepTime,   field: 'sleepTime',
                options: ['Before 10PM', '10PM - 12AM', '12AM - 2AM', 'After 2AM'] },
              { label: 'Usual Wake Time',   value: wakeTime,    set: setWakeTime,    field: 'wakeTime',
                options: ['Before 6AM', '6AM - 8AM', '8AM - 10AM', 'After 10AM'] },
              { label: 'Daily Study Hours', value: studyHours,  set: setStudyHours,  field: 'studyHours',
                options: ['0-2 hrs', '2-4 hrs', '4-6 hrs', '6+ hrs'] },
              { label: 'Cleanliness Level', value: cleanliness, set: setCleanliness, field: 'cleanliness',
                options: ['Very Clean', 'Clean', 'Moderate', 'Relaxed'] },
              { label: 'Noise Preference',  value: noise,       set: setNoise,       field: 'noise',
                options: ['Silent', 'Quiet', 'Moderate', 'Loud'] },
              { label: 'Guests / Visitors', value: guests,      set: setGuests,      field: 'guests',
                options: ['No guests', 'Rare guests', 'Occasional', 'Frequent ok'] },
            ].map(item => (
              <div key={item.field}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{item.label}</label>
                <select value={item.value} onChange={(e) => item.set(e.target.value)} className={selectClass(item.field)}>
                  <option value="">Select...</option>
                  {item.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors[item.field] && <p className="text-red-500 text-xs mt-1">{errors[item.field]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Short Bio <span className="text-slate-300 font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="I am a CSE student who loves coding at night..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* AI Section */}
            <div className="border border-purple-100 rounded-xl p-4 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✨</span>
                <label className="text-sm font-semibold text-purple-700">AI Trait Extraction</label>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">
                  Powered by Gemini
                </span>
              </div>
              <p className="text-xs text-purple-500 mb-3">
                Describe yourself — Gemini will extract your personality traits automatically
              </p>
              <textarea
                placeholder="I'm a night owl who loves coding and gaming. I'm quite introverted and prefer a quiet environment..."
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400 resize-none bg-white mb-3"
              />
              <button
                type="button"
                onClick={handleExtractTraits}
                disabled={extracting}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {extracting ? '✨ Analyzing with Gemini...' : '✨ Extract My Traits'}
              </button>

              {aiTraits.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-purple-600 font-medium mb-2">Detected traits — click to remove:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiTraits.map((trait, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => removeTrait(trait)}
                        className="text-xs px-3 py-1 rounded-full bg-white text-purple-600 border border-purple-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                      >
                        {trait} ✕
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>

          </form>
        </div>

        {/* Live Preview */}
        <div className="w-72 flex-shrink-0 sticky top-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-3">
            Live Preview
          </p>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3">
              {initials}
            </div>
            <div className="text-lg font-semibold text-slate-900">{userName}</div>
            <div className="text-sm text-slate-400 mb-3">{userBranch} • Year {userYear}</div>

            <div className="flex flex-wrap gap-1.5 justify-center mb-3">
              {sleepTime   && <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">{sleepTime}</span>}
              {cleanliness && <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">{cleanliness}</span>}
              {noise       && <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">{noise}</span>}
              {studyHours  && <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">{studyHours}</span>}
            </div>

            {aiTraits.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                {aiTraits.map((trait, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                    ✨ {trait}
                  </span>
                ))}
              </div>
            )}

            {[
              { label: 'Sleeps',  value: sleepTime   || '—' },
              { label: 'Wakes',   value: wakeTime    || '—' },
              { label: 'Studies', value: studyHours  || '—' },
              { label: 'Clean',   value: cleanliness || '—' },
              { label: 'Noise',   value: noise       || '—' },
              { label: 'Guests',  value: guests      || '—' },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-50 text-sm">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-slate-700 font-medium">{item.value}</span>
              </div>
            ))}

            {about && <p className="text-xs text-slate-400 mt-3 text-left">{about}</p>}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile