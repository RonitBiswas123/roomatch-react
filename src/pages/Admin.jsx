import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getAdminStats } from '../api'

function Admin({ navigate, userProfile, onLogout }) {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getAdminStats()
      .then(data => setStats(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const maxBranch = stats ? Math.max(...stats.branch_stats.map(b => b.count)) : 1

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} onLogout={onLogout} />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard 📊</h2>
          <p className="text-sm text-slate-400">Platform statistics and insights</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading stats...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : stats && (
          <>
            {/* Main stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { num: stats.total_students,    label: 'Students',     icon: '👥', color: 'text-blue-600'   },
                { num: stats.total_profiles,    label: 'Profiles',     icon: '📝', color: 'text-green-600'  },
                { num: stats.total_requests,    label: 'Requests',     icon: '📤', color: 'text-yellow-600' },
                { num: stats.total_connections, label: 'Connected',    icon: '🤝', color: 'text-purple-600' },
                { num: stats.pending_requests,  label: 'Pending',      icon: '⏳', color: 'text-orange-500' },
                { num: stats.ai_profiles,       label: 'AI Profiles',  icon: '✨', color: 'text-pink-600'   },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.num}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Branch chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Students by Branch</h3>
                <div className="flex flex-col gap-3">
                  {stats.branch_stats.map(b => (
                    <div key={b.branch}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700">{b.branch}</span>
                        <span className="text-sm font-bold text-blue-600">{b.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{ width: `${(b.count / maxBranch) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Year + Gender stats */}
              <div className="flex flex-col gap-4">

                {/* Year distribution */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Students by Year</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(year => {
                      const stat = stats.year_stats.find(y => y.year === year)
                      return (
                        <div key={year} className="text-center bg-slate-50 rounded-xl p-3">
                          <div className="text-lg font-bold text-blue-600">{stat ? stat.count : 0}</div>
                          <div className="text-xs text-slate-400">Year {year}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Gender distribution */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Students by Gender</h3>
                  <div className="flex gap-3">
                    {stats.gender_stats.map(g => (
                      <div key={g.gender} className="flex-1 text-center bg-slate-50 rounded-xl p-3">
                        <div className="text-lg font-bold text-purple-600">{g.count}</div>
                        <div className="text-xs text-slate-400">{g.gender}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connection rate */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Connection Rate</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: stats.total_requests > 0 ? `${(stats.total_connections / stats.total_requests) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {stats.total_requests > 0
                        ? Math.round((stats.total_connections / stats.total_requests) * 100)
                        : 0}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {stats.total_connections} connections from {stats.total_requests} requests
                  </p>
                </div>

              </div>
            </div>

            {/* Recent registrations */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Registrations</h3>
              <div className="flex flex-col gap-3">
                {stats.recent_users.map((user, i) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-slate-600">{user.branch} • Year {user.year}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  )
}

export default Admin