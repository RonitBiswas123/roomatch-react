import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'

const allStudents = [
  { id: 1, name: 'Rahul Sharma',  branch: 'CSE', year: 2, gender: 'Male',   sleepTime: '12AM - 2AM',  cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '4-6 hrs' },
  { id: 2, name: 'Priya Singh',   branch: 'ECE', year: 2, gender: 'Female', sleepTime: '10PM - 12AM', cleanliness: 'Very Clean', noise: 'Silent',   studyHours: '6+ hrs'  },
  { id: 3, name: 'Arjun Mehta',   branch: 'CSE', year: 3, gender: 'Male',   sleepTime: 'After 2AM',   cleanliness: 'Moderate',   noise: 'Moderate', studyHours: '2-4 hrs' },
  { id: 4, name: 'Sneha Reddy',   branch: 'ME',  year: 1, gender: 'Female', sleepTime: 'Before 10PM', cleanliness: 'Clean',      noise: 'Quiet',    studyHours: '4-6 hrs' },
  { id: 5, name: 'Vikram Nair',   branch: 'EE',  year: 2, gender: 'Male',   sleepTime: '10PM - 12AM', cleanliness: 'Relaxed',    noise: 'Loud',     studyHours: '0-2 hrs' },
  { id: 6, name: 'Ananya Gupta',  branch: 'CSE', year: 3, gender: 'Female', sleepTime: '12AM - 2AM',  cleanliness: 'Clean',      noise: 'Moderate', studyHours: '4-6 hrs' },
]

function calcCompatibility(userProfile, student) {
  let score = 0
  if (userProfile.sleepTime   === student.sleepTime)   score += 30
  if (userProfile.branch      === student.branch)      score += 20
  if (userProfile.cleanliness === student.cleanliness) score += 20
  if (userProfile.noise       === student.noise)       score += 15
  if (userProfile.studyHours  === student.studyHours)  score += 15
  return score
}

function Dashboard({ navigate, userProfile, onLogout }) {
  const [loading,   setLoading]   = useState(true)
  const [matches,   setMatches]   = useState([])
  const [stats,     setStats]     = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [greeting,  setGreeting]  = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if      (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else                setGreeting('Good Evening')
  }, [])

  useEffect(() => {
    if (!userProfile) return
    setLoading(true)
    const timer = setTimeout(() => {
      const scored = allStudents.map(student => ({
        ...student,
        compatibility: calcCompatibility(userProfile, student)
      }))
      const sorted = scored.sort((a, b) => b.compatibility - a.compatibility)
      setMatches(sorted)
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [userProfile])

  useEffect(() => {
    if (matches.length === 0) return
    const topMatch    = matches[0]
    const avgScore    = Math.round(matches.reduce((sum, m) => sum + m.compatibility, 0) / matches.length)
    const highMatches = matches.filter(m => m.compatibility >= 50).length
    setStats({ topMatch, avgScore, highMatches })
  }, [matches])

  useEffect(() => {
    if (userProfile) document.title = `${userProfile.name} — RoomMatch`
    return () => { document.title = 'RoomMatch' }
  }, [userProfile])

  if (!userProfile) {
    return (
      <div>
        <Navbar navigate={navigate} onLogout={onLogout} />
        <div className="success-container">
          <div className="success-card">
            <h2>No Profile Found</h2>
            <p>Please register and set up your profile first.</p>
            <Button text="Get Started" type="primary" onClick={() => navigate('register')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar navigate={navigate} userProfile={userProfile} onLogout={onLogout} />

      <div className="dashboard-container">

        <div className="dashboard-header">
          <div>
            <h2>{greeting}, {userProfile.name.split(' ')[0]}! 👋</h2>
            <p style={{ color: '#888', marginTop: 4 }}>
              {userProfile.branch} • Year {userProfile.year} • {userProfile.gender}
            </p>
          </div>
          <Button text="Edit Profile" type="outline" onClick={() => navigate('profile')} />
        </div>

        <div className="dashboard-tabs">
          {['overview', 'matches', 'profile'].map(tab => (
            <button
              key={tab}
              className={`dash-tab ${activeTab === tab ? 'dash-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Finding your matches...</p>
              </div>
            ) : (
              <>
                {stats && (
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-num">{matches.length}</div>
                      <div className="stat-label">Total Students</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-num">{stats.highMatches}</div>
                      <div className="stat-label">Good Matches</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-num">{stats.avgScore}%</div>
                      <div className="stat-label">Avg Compatibility</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-num">{stats.topMatch.compatibility}%</div>
                      <div className="stat-label">Best Match</div>
                    </div>
                  </div>
                )}
                <h3 className="section-title">Your Top Match</h3>
                {stats && (
                  <div className="cards-grid" style={{ padding: 0 }}>
                    <Card
                      name={stats.topMatch.name}
                      branch={stats.topMatch.branch}
                      year={stats.topMatch.year}
                      gender={stats.topMatch.gender}
                      compatibility={stats.topMatch.compatibility}
                      sleepTime={stats.topMatch.sleepTime}
                      cleanliness={stats.topMatch.cleanliness}
                      noise={stats.topMatch.noise}
                      studyHours={stats.topMatch.studyHours}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading matches...</p>
              </div>
            ) : (
              <>
                <h3 className="section-title">All Matches — sorted by compatibility</h3>
                <div className="cards-grid" style={{ padding: 0 }}>
                  {matches.map(student => (
                    <Card
                      key={student.id}
                      name={student.name}
                      branch={student.branch}
                      year={student.year}
                      gender={student.gender}
                      compatibility={student.compatibility}
                      sleepTime={student.sleepTime}
                      cleanliness={student.cleanliness}
                      noise={student.noise}
                      studyHours={student.studyHours}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-summary">
            <h3 className="section-title">Your Habits</h3>
            <div className="habit-grid">
              {[
                { label: 'Sleep Time',  value: userProfile.sleepTime,   icon: '🌙' },
                { label: 'Wake Time',   value: userProfile.wakeTime,    icon: '☀️' },
                { label: 'Study Hours', value: userProfile.studyHours,  icon: '📚' },
                { label: 'Cleanliness', value: userProfile.cleanliness, icon: '✨' },
                { label: 'Noise Level', value: userProfile.noise,       icon: '🔊' },
                { label: 'Guests',      value: userProfile.guests,      icon: '👥' },
              ].map(item => (
                <div key={item.label} className="habit-card">
                  <div className="habit-icon">{item.icon}</div>
                  <div className="habit-label">{item.label}</div>
                  <div className="habit-value">{item.value || '—'}</div>
                </div>
              ))}
            </div>
            {userProfile.about && (
              <div className="about-box">
                <h4>About</h4>
                <p>{userProfile.about}</p>
              </div>
            )}
            <div style={{ marginTop: 24 }}>
              <Button text="Edit Profile" type="primary" onClick={() => navigate('profile')} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard