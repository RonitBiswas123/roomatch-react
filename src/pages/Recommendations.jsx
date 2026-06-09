import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import CompatibilityBreakdown from '../components/CompatibilityBreakdown'
import { getRecommendations, sendRequest, getRequests } from '../api'

function Recommendations({ navigate, userProfile, onLogout }) {
  const [recommendations, setRecommendations] = useState([])
  const [algorithm,       setAlgorithm]       = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [sentRequests,    setSentRequests]     = useState([])
  const [sending,         setSending]         = useState(null)
  const [toast,           setToast]           = useState('')
  const [selected,        setSelected]        = useState(null)
  const [minScore,        setMinScore]        = useState(0)
  const [genderFilter,    setGenderFilter]    = useState('')
  const [bookmarks,       setBookmarks]       = useState([])
  const [showBookmarked,  setShowBookmarked]  = useState(false)

  const fetchData = (filters = {}) => {
    setLoading(true)
    Promise.all([
      getRecommendations(filters),
      getRequests()
    ])
      .then(([recData, reqData]) => {
        setRecommendations(recData.recommendations)
        setAlgorithm(recData.algorithm)
        setSentRequests(reqData.sent || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    const saved = localStorage.getItem('rm_bookmarks')
    if (saved) setBookmarks(JSON.parse(saved))
  }, [])

  const applyFilters = () => {
    fetchData({ minScore, gender: genderFilter })
  }

  const resetFilters = () => {
    setMinScore(0)
    setGenderFilter('')
    setShowBookmarked(false)
    fetchData()
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleConnect = async (studentId, studentName) => {
    setSending(studentId)
    try {
      await sendRequest(studentId)
      setSentRequests(prev => [...prev, { receiver_id: studentId, status: 'pending' }])
      showToast(`Request sent to ${studentName}! 🎉`)
    } catch (err) {
      showToast(err.message)
    } finally {
      setSending(null)
    }
  }

  const toggleBookmark = (studentId) => {
    const updated = bookmarks.includes(studentId)
      ? bookmarks.filter(id => id !== studentId)
      : [...bookmarks, studentId]
    setBookmarks(updated)
    localStorage.setItem('rm_bookmarks', JSON.stringify(updated))
  }

  const getStatus = (studentId) => {
    const req = sentRequests.find(r => r.receiver_id === studentId)
    return req ? req.status : null
  }

  const compatColor = (score) =>
    score >= 70 ? 'text-green-500' :
    score >= 40 ? 'text-yellow-500' : 'text-red-400'

  const compatBg = (score) =>
    score >= 70 ? 'bg-green-400' :
    score >= 40 ? 'bg-yellow-400' : 'bg-red-400'

  const rankMedal = (index) => ['🥇', '🥈', '🥉'][index] || null

  const displayList = showBookmarked
    ? recommendations.filter(s => bookmarks.includes(s.id))
    : recommendations

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} onLogout={onLogout} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Breakdown popup */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={() => setSelected(null)}>
          <div className="max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <CompatibilityBreakdown student={selected} userProfile={userProfile} />
            <button onClick={() => setSelected(null)}
              className="w-full mt-3 py-2 bg-white rounded-xl text-sm text-slate-600 hover:bg-slate-50">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Top 10 Matches 🎯</h2>
            <p className="text-sm text-slate-400">Ranked by compatibility based on your habits</p>
          </div>
          <button
            onClick={() => setShowBookmarked(!showBookmarked)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showBookmarked
                ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {showBookmarked ? '⭐ Bookmarked' : '☆ Bookmarks'} ({bookmarks.length})
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Filter Recommendations</h3>
          <div className="flex flex-wrap gap-4 items-end">

            <div>
              <label className="block text-xs text-slate-400 mb-1">Min Compatibility</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0" max="100" step="10"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-semibold text-blue-600 w-10">{minScore}%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50"
              >
                Reset
              </button>
            </div>

          </div>
        </div>

        {/* Algorithm card */}
        {algorithm && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Scoring weights</h3>
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'Sleep',  score: algorithm.sleep_time,  icon: '🌙' },
                { label: 'Branch', score: algorithm.branch,      icon: '🎓' },
                { label: 'Clean',  score: algorithm.cleanliness, icon: '✨' },
                { label: 'Study',  score: algorithm.study_hours, icon: '📚' },
                { label: 'Noise',  score: algorithm.noise,       icon: '🔊' },
              ].map(item => (
                <div key={item.label} className="text-center bg-slate-50 rounded-xl p-3">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-lg font-bold text-blue-600">+{item.score}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your habits */}
        {userProfile && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
            <h3 className="text-xs font-semibold text-blue-700 mb-2">Your matching profile</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Sleep',  value: userProfile.sleepTime   },
                { label: 'Study',  value: userProfile.studyHours  },
                { label: 'Clean',  value: userProfile.cleanliness },
                { label: 'Noise',  value: userProfile.noise       },
                { label: 'Branch', value: userProfile.branch      },
              ].map(item => item.value && (
                <span key={item.label} className="text-xs px-3 py-1 bg-white rounded-full border border-blue-200 text-blue-700 font-medium">
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Calculating your top matches...</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-4">{showBookmarked ? '⭐' : '🔍'}</p>
            <p className="font-medium">{showBookmarked ? 'No bookmarks yet' : 'No matches found'}</p>
            <p className="text-sm mt-1">{showBookmarked ? 'Bookmark students to save them here' : 'Try lowering the minimum compatibility filter'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayList.map((student, index) => {
              const status   = getStatus(student.id)
              const medal    = rankMedal(index)
              const isBookmarked = bookmarks.includes(student.id)

              return (
                <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">

                  <div className="relative">
                    <div
                      className={`h-1.5 ${compatBg(student.compatibility)}`}
                      style={{ width: `${student.compatibility}%` }}
                    />
                  </div>

                  <div className="p-5">

                    {/* Top row */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                          {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        {medal && (
                          <span className="absolute -top-1 -right-1 text-sm">{medal}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-sm text-slate-400">{student.branch} • Year {student.year}</div>
                        <div className="text-xs text-slate-400">{student.gender}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className={`text-xl font-bold ${compatColor(student.compatibility)}`}>
                          {student.compatibility}%
                        </div>
                        <button onClick={() => toggleBookmark(student.id)} className="text-sm">
                          {isBookmarked ? '⭐' : '☆'}
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-400">Compatibility</span>
                        <span className={`text-xs font-semibold ${compatColor(student.compatibility)}`}>
                          {student.compatibility >= 80 ? '🔥 Excellent' :
                           student.compatibility >= 60 ? '✅ Good' :
                           student.compatibility >= 40 ? '🟡 Fair' : '❌ Low'}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${compatBg(student.compatibility)}`}
                          style={{ width: `${student.compatibility}%` }}
                        />
                      </div>
                    </div>

                    {/* Match reasons */}
                    {student.match_reasons.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {student.match_reasons.map((reason, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {student.match_reasons.length === 0 && (
                      <p className="text-xs text-slate-400 mb-4">No matching habits</p>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(student)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Breakdown
                      </button>

                      {status === 'pending' ? (
                        <button disabled className="flex-1 py-2 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-medium">
                          ⏳ Pending
                        </button>
                      ) : status === 'accepted' ? (
                        <button disabled className="flex-1 py-2 rounded-lg bg-green-50 border border-green-200 text-green-600 text-xs font-medium">
                          ✅ Connected
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(student.id, student.name)}
                          disabled={sending === student.id}
                          className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-medium transition-colors"
                        >
                          {sending === student.id ? '...' : 'Connect 🤝'}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommendations