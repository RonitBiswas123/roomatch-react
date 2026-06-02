import { useState } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'

function Profile({ navigate, user, setUserProfile }) {
  const [sleepTime,   setSleepTime]   = useState('')
  const [wakeTime,    setWakeTime]    = useState('')
  const [studyHours,  setStudyHours]  = useState('')
  const [cleanliness, setCleanliness] = useState('')
  const [noise,       setNoise]       = useState('')
  const [guests,      setGuests]      = useState('')
  const [about,       setAbout]       = useState('')
  const [errors,      setErrors]      = useState({})
  const [saved,       setSaved]       = useState(false)

  const userName   = user ? user.name   : 'Your Name'
  const userBranch = user ? user.branch : 'Branch'
  const userYear   = user ? user.year   : '1'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const fullProfile = { ...user, sleepTime, wakeTime, studyHours, cleanliness, noise, guests, about }
    console.log('Profile saved:', fullProfile)
    setUserProfile(fullProfile)
    setSaved(true)
  }

 if (saved) {
  return (
    <div>
      <Navbar navigate={navigate} />
      <div className="success-container">
        <div className="success-card">
          <h2>Profile Saved!</h2>
          <p>Your profile is ready. Go to your dashboard!</p>
          <button
            className="btn btn-primary"
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
    <div>
      <Navbar navigate={navigate} />
      <div className="profile-setup-container">

        <div className="profile-setup-form">
          <h2>Set Up Your Profile</h2>
          <p className="subtitle">Tell us about your habits so we can find your perfect match</p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Usual Sleep Time</label>
              <select value={sleepTime} onChange={(e) => setSleepTime(e.target.value)}
                className={errors.sleepTime ? 'input-error' : ''}>
                <option value="">Select sleep time</option>
                <option value="Before 10PM">Before 10 PM</option>
                <option value="10PM - 12AM">10 PM – 12 AM</option>
                <option value="12AM - 2AM">12 AM – 2 AM</option>
                <option value="After 2AM">After 2 AM</option>
              </select>
              {errors.sleepTime && <span className="error-msg">{errors.sleepTime}</span>}
            </div>

            <div className="form-group">
              <label>Usual Wake Time</label>
              <select value={wakeTime} onChange={(e) => setWakeTime(e.target.value)}
                className={errors.wakeTime ? 'input-error' : ''}>
                <option value="">Select wake time</option>
                <option value="Before 6AM">Before 6 AM</option>
                <option value="6AM - 8AM">6 AM – 8 AM</option>
                <option value="8AM - 10AM">8 AM – 10 AM</option>
                <option value="After 10AM">After 10 AM</option>
              </select>
              {errors.wakeTime && <span className="error-msg">{errors.wakeTime}</span>}
            </div>

            <div className="form-group">
              <label>Daily Study Hours</label>
              <select value={studyHours} onChange={(e) => setStudyHours(e.target.value)}
                className={errors.studyHours ? 'input-error' : ''}>
                <option value="">Select study hours</option>
                <option value="0-2 hrs">0 – 2 hours</option>
                <option value="2-4 hrs">2 – 4 hours</option>
                <option value="4-6 hrs">4 – 6 hours</option>
                <option value="6+ hrs">6+ hours</option>
              </select>
              {errors.studyHours && <span className="error-msg">{errors.studyHours}</span>}
            </div>

            <div className="form-group">
              <label>Cleanliness Level</label>
              <select value={cleanliness} onChange={(e) => setCleanliness(e.target.value)}
                className={errors.cleanliness ? 'input-error' : ''}>
                <option value="">Select cleanliness</option>
                <option value="Very Clean">Very Clean</option>
                <option value="Clean">Clean</option>
                <option value="Moderate">Moderate</option>
                <option value="Relaxed">Relaxed</option>
              </select>
              {errors.cleanliness && <span className="error-msg">{errors.cleanliness}</span>}
            </div>

            <div className="form-group">
              <label>Noise Preference</label>
              <select value={noise} onChange={(e) => setNoise(e.target.value)}
                className={errors.noise ? 'input-error' : ''}>
                <option value="">Select noise preference</option>
                <option value="Silent">Silent always</option>
                <option value="Quiet">Mostly quiet</option>
                <option value="Moderate">Moderate noise ok</option>
                <option value="Loud">Loud is fine</option>
              </select>
              {errors.noise && <span className="error-msg">{errors.noise}</span>}
            </div>

            <div className="form-group">
              <label>Guests / Visitors</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}
                className={errors.guests ? 'input-error' : ''}>
                <option value="">Select guest preference</option>
                <option value="No guests">No guests</option>
                <option value="Rare guests">Rare guests ok</option>
                <option value="Occasional">Occasional guests</option>
                <option value="Frequent ok">Frequent guests ok</option>
              </select>
              {errors.guests && <span className="error-msg">{errors.guests}</span>}
            </div>

            <div className="form-group">
              <label>About You <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                placeholder="I am a CSE student who loves coding at night..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={3}
              />
            </div>

            <Button text="Save Profile" type="primary" fullWidth={true} submit={true} />
          </form>
        </div>

        <div className="profile-setup-preview">
          <p className="preview-label">Live Preview</p>
          <div className="profile-card">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-name">{userName}</div>
            <div className="profile-branch">{userBranch} • Year {userYear}</div>
            <div className="profile-tags">
              {sleepTime   && <span className="tag">{sleepTime}</span>}
              {cleanliness && <span className="tag">{cleanliness}</span>}
              {noise       && <span className="tag">{noise}</span>}
              {studyHours  && <span className="tag">{studyHours}</span>}
            </div>
            <div style={{ marginTop: 16, width: '100%' }}>
              {[
                { label: 'Sleeps',  value: sleepTime   || '—' },
                { label: 'Wakes',   value: wakeTime    || '—' },
                { label: 'Studies', value: studyHours  || '—' },
                { label: 'Clean',   value: cleanliness || '—' },
                { label: 'Noise',   value: noise       || '—' },
                { label: 'Guests',  value: guests      || '—' },
              ].map(item => (
                <div key={item.label} className="preview-row">
                  <span className="preview-key">{item.label}</span>
                  <span className="preview-val">{item.value}</span>
                </div>
              ))}
            </div>
            {about && <p style={{ fontSize: 13, color: '#888', marginTop: 12, textAlign: 'left' }}>{about}</p>}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile