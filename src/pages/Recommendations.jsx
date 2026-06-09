import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getRecommendations, sendRequest, getRequests } from '../api'

function Recommendations({ navigate, userProfile, onLogout }) {
  const [recommendations, setRecommendations] = useState([])
  const [algorithm,       setAlgorithm]       = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [sentRequests,    setSentRequests]     = useState([])
  const [sending,         setSending]         = useState(null)
  const [toast,           setToast]           = useState('')

  useEffect(() => {
    Promise.all([getRecommendations(), getRequests()])
      .then(([recData, reqData]) => {
        setRecommendations(recData.recommendations)
        setAlgorithm(recData.algorithm)
        setSentRequests(reqData.sent || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} onLogout={onLogout} />

      {toast && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Your Top Matches 🎯
          </h2>
          <p className="text-sm text-slate-400">
            Ranked by compatibility score based on your habits and preferences
          </p>
        </div>

        {/* Algorithm explanation */}
        {algorithm && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              How compatibility is calculated
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'Sleep Time',  score: algorithm.sleep_time,  icon: '🌙' },
                { label: 'Branch',      score: algorithm.branch,      icon: '🎓' },
                { label: 'Cleanliness', score: algorithm.cleanliness, icon: '✨' },
                { label: 'Study Hours', score: algorithm.study_hours, icon: '📚' },
                { label: 'Noise',       score: algorithm.noise,       icon: '🔊' },
              ].map(item => (
                <div key={item.label} className="text-center bg-slate-50 rounded-xl p-3">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-lg font-bold text-blue-600">+{item.score}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Max score = 100% — each matching habit adds points to compatibility
            </p>
          </div>
        )}

        {/* Your profile summary */}
        {userProfile && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-blue-700 mb-3">Your profile used for matching</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Sleep', value: userProfile.sleepTime },
                { label: 'Study', value: userProfile.studyHours },
                { label: 'Clean', value: userProfile.cleanliness },
                { label: 'Noise', value: userProfile.noise },
                { label: 'Branch', value: userProfile.branch },
              ].map(item => item.value && (
                <span key={item.label} className="text-xs px-3 py-1.5 bg-white rounded-full border border-blue-200 text-blue-700 font-medium">
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Calculating your matches...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-medium">No recommendations yet</p>
            <p className="text-sm mt-1">More students need to set up profiles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((student, index) => {
              const status = getStatus(student.id)
              return (
                <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">

                  {/* Rank badge */}
                  <div className="relative">
                    <div
                      className={`h-1.5 ${compatBg(student.compatibility)}`}
                      style={{ width: `${student.compatibility}%` }}
                    />
                    {index < 3 && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-400 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-sm text-slate-400">{student.branch} • Year {student.year}</div>
                      </div>
                      <div className={`text-xl font-bold ${compatColor(student.compatibility)}`}>
                        {student.compatibility}%
                      </div>
                    </div>

                    {/* Match reasons */}
                    {student.match_reasons.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-400 mb-1.5">Why you match:</p>
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
                      <p className="text-xs text-slate-400 mb-3">No matching habits yet</p>
                    )}

                    {/* Connect button */}
                    {status === 'pending' ? (
                      <button disabled className="w-full py-2 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-600 text-sm font-medium">
                        ⏳ Request Pending
                      </button>
                    ) : status === 'accepted' ? (
                      <button disabled className="w-full py-2 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm font-medium">
                        ✅ Connected
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(student.id, student.name)}
                        disabled={sending === student.id}
                        className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium transition-colors"
                      >
                        {sending === student.id ? 'Sending...' : 'Connect 🤝'}
                      </button>
                    )}
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