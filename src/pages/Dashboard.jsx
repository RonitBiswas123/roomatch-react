import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import ProfileCard from '../components/ProfileCard'
import FilterBar from '../components/FilterBar'
import { getStudents } from '../api'
import { getRecommendations } from '../api'

function calcCompatibility(userProfile, student) {
  let score = 0
  if (userProfile.sleepTime   === student.sleep_time)   score += 30
  if (userProfile.branch      === student.branch)       score += 20
  if (userProfile.cleanliness === student.cleanliness)  score += 20
  if (userProfile.noise       === student.noise)        score += 15
  if (userProfile.studyHours  === student.study_hours)  score += 15
  return score
}

function Dashboard({ navigate, userProfile, onLogout }) {
  const [loading,      setLoading]      = useState(true)
  const [matches,      setMatches]      = useState([])
  const [stats,        setStats]        = useState(null)
  const [activeTab,    setActiveTab]    = useState('overview')
  const [greeting,     setGreeting]     = useState('')
  const [search,       setSearch]       = useState('')
  const [filterBranch, setFilterBranch] = useState('')
  const [filterYear,   setFilterYear]   = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [sortBy,       setSortBy]       = useState('compatibility')

  useEffect(() => {
    const hour = new Date().getHours()
    if      (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else                setGreeting('Good Evening')
  }, [])

 

useEffect(() => {
  if (!userProfile) return
  setLoading(true)

  getRecommendations()
    .then(data => {
      const scored = data.recommendations.map(s => ({
        ...s,
        sleepTime:  s.sleep_time,
        wakeTime:   s.wake_time,
        studyHours: s.study_hours,
      }))
      setMatches(scored)
    })
    .catch(() => {})
    .finally(() => setLoading(false))
}, [userProfile])

  useEffect(() => {
    if (matches.length === 0) return
    setStats({
      topMatch:    matches[0],
      avgScore:    Math.round(matches.reduce((s, m) => s + m.compatibility, 0) / matches.length),
      highMatches: matches.filter(m => m.compatibility >= 50).length
    })
  }, [matches])

  useEffect(() => {
    if (userProfile) document.title = `${userProfile.name} — RoomMatch`
    return () => { document.title = 'RoomMatch' }
  }, [userProfile])

  const filteredMatches = useMemo(() => {
    let result = [...matches]
    if (search)       result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    if (filterBranch) result = result.filter(s => s.branch === filterBranch)
    if (filterYear)   result = result.filter(s => String(s.year) === filterYear)
    if (filterGender) result = result.filter(s => s.gender === filterGender)
    if (sortBy === 'compatibility') result.sort((a, b) => b.compatibility - a.compatibility)
    if (sortBy === 'name')          result.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'year')          result.sort((a, b) => a.year - b.year)
    return result
  }, [matches, search, filterBranch, filterYear, filterGender, sortBy])

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar navigate={navigate} onLogout={onLogout} />
        <div className="flex justify-center items-center min-h-[85vh] px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No Profile Found</h2>
            <p className="text-slate-400 mb-8">Please register and set up your profile first.</p>
            <Button text="Get Started" type="primary" onClick={() => navigate('register')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} onLogout={onLogout} />

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {greeting}, {userProfile.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {userProfile.branch} • Year {userProfile.year} • {userProfile.gender}
            </p>
          </div>
          <Button text="Edit Profile" type="outline" onClick={() => navigate('profile')} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-8">
          {['overview', 'matches', 'profile'].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          loading ? (
            <div className="text-center py-20 text-slate-400">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p>Finding your matches...</p>
            </div>
          ) : (
            <>
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { num: matches.length,                     label: 'Total Students'    },
                    { num: stats.highMatches,                  label: 'Good Matches'      },
                    { num: `${stats.avgScore}%`,               label: 'Avg Compatibility' },
                    { num: `${stats.topMatch.compatibility}%`, label: 'Best Match'        },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-5 text-center shadow-sm">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{s.num}</div>
                      <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                Your Top Match
              </h3>
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <ProfileCard
                    name={stats.topMatch.name}
                    branch={stats.topMatch.branch}
                    year={stats.topMatch.year}
                    gender={stats.topMatch.gender}
                    compatibility={stats.topMatch.compatibility}
                    sleepTime={stats.topMatch.sleepTime}
                    wakeTime={stats.topMatch.wakeTime}
                    cleanliness={stats.topMatch.cleanliness}
                    noise={stats.topMatch.noise}
                    studyHours={stats.topMatch.studyHours}
                    guests={stats.topMatch.guests}
                    about={stats.topMatch.about}
                  />
                </div>
              )}
            </>
          )
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          loading ? (
            <div className="text-center py-20 text-slate-400">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading matches...</p>
            </div>
          ) : (
            <>
              <FilterBar
                search={search}             setSearch={setSearch}
                filterBranch={filterBranch} setFilterBranch={setFilterBranch}
                filterYear={filterYear}     setFilterYear={setFilterYear}
                filterGender={filterGender} setFilterGender={setFilterGender}
                sortBy={sortBy}             setSortBy={setSortBy}
              />
              <p className="text-sm text-slate-400 mb-4">
                Showing <span className="font-semibold text-slate-700">{filteredMatches.length}</span> students
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMatches.map(student => (
                  <ProfileCard
                    key={student.id}
                    name={student.name}
                    branch={student.branch}
                    year={student.year}
                    gender={student.gender}
                    compatibility={student.compatibility}
                    sleepTime={student.sleepTime}
                    wakeTime={student.wakeTime}
                    cleanliness={student.cleanliness}
                    noise={student.noise}
                    studyHours={student.studyHours}
                    guests={student.guests}
                    about={student.about}
                  />
                ))}
              </div>
            </>
          )
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
              Your Habits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Sleep Time',  value: userProfile.sleepTime,   icon: '🌙' },
                { label: 'Wake Time',   value: userProfile.wakeTime,    icon: '☀️' },
                { label: 'Study Hours', value: userProfile.studyHours,  icon: '📚' },
                { label: 'Cleanliness', value: userProfile.cleanliness, icon: '✨' },
                { label: 'Noise Level', value: userProfile.noise,       icon: '🔊' },
                { label: 'Guests',      value: userProfile.guests,      icon: '👥' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl p-5 text-center shadow-sm">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-slate-900">{item.value || '—'}</div>
                </div>
              ))}
            </div>
            {userProfile.about && (
              <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
                <h4 className="text-xs text-slate-400 font-semibold mb-2">About</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{userProfile.about}</p>
              </div>
            )}
            <Button text="Edit Profile" type="primary" onClick={() => navigate('profile')} />
          </>
        )}

      </div>
    </div>
  )
}

export default Dashboard