import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getRequests, updateRequest } from '../api'

function Requests({ navigate, userProfile, onLogout }) {
  const [sent,      setSent]      = useState([])
  const [received,  setReceived]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [activeTab, setActiveTab] = useState('received')
  const [updating,  setUpdating]  = useState(null)
  const [toast,     setToast]     = useState({ msg: '', type: 'success' })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = () => {
    setLoading(true)
    getRequests()
      .then(data => {
        setSent(data.sent || [])
        setReceived(data.received || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000)
  }

  const handleUpdate = async (requestId, status, name) => {
    setUpdating(requestId)
    try {
      await updateRequest(requestId, status)
      setReceived(prev =>
        prev.map(r => r.id === requestId ? { ...r, status } : r)
      )
      if (status === 'accepted') {
        showToast(`You are now connected with ${name}! 🎉`, 'success')
      } else {
        showToast(`Request from ${name} declined`, 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setUpdating(null)
    }
  }

  const pendingReceived  = received.filter(r => r.status === 'pending')
  const acceptedReceived = received.filter(r => r.status === 'accepted')
  const declinedReceived = received.filter(r => r.status === 'declined')
  const pendingSent      = sent.filter(r => r.status === 'pending')
  const acceptedSent     = sent.filter(r => r.status === 'accepted')
  const declinedSent     = sent.filter(r => r.status === 'declined')
  const allConnected     = [...acceptedReceived, ...acceptedSent]

  const StatusBadge = ({ status }) => {
    const styles = {
      pending:  'bg-yellow-50 text-yellow-600 border-yellow-200',
      accepted: 'bg-green-50 text-green-600 border-green-200',
      declined: 'bg-red-50 text-red-400 border-red-200',
    }
    const labels = { pending: '⏳ Pending', accepted: '✅ Accepted', declined: '❌ Declined' }
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const Avatar = ({ name, color = 'bg-blue-600' }) => (
    <div className={`w-10 h-10 rounded-full ${color} text-white font-bold text-sm flex items-center justify-center flex-shrink-0`}>
      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
    </div>
  )

  const StudentInfo = ({ request }) => (
    <div className="flex items-center gap-3 flex-1">
      <Avatar name={request.name} color={request.status === 'accepted' ? 'bg-green-600' : 'bg-blue-600'} />
      <div>
        <div className="font-medium text-slate-900 text-sm">{request.name}</div>
        <div className="text-xs text-slate-400">{request.branch} • Year {request.year} • {request.gender}</div>
      </div>
    </div>
  )

  const EmptyState = ({ icon, title, subtitle, action, actionLabel }) => (
    <div className="text-center py-16 text-slate-400">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-medium text-slate-600">{title}</p>
      <p className="text-sm mt-1">{subtitle}</p>
      {action && (
        <button onClick={action}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          {actionLabel}
        </button>
      )}
    </div>
  )

  const Section = ({ title, count, children }) => (
    count > 0 ? (
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          {title} — {count}
        </p>
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    ) : null
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} onLogout={onLogout} />

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-4 right-4 px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium text-white ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Roommate Requests</h2>
            <p className="text-sm text-slate-400">Manage your incoming and outgoing requests</p>
          </div>
          <button
            onClick={fetchRequests}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { num: pendingReceived.length,  label: 'Pending',   color: 'text-yellow-500' },
            { num: allConnected.length,     label: 'Connected', color: 'text-green-500'  },
            { num: pendingSent.length,      label: 'Sent',      color: 'text-blue-500'   },
            { num: received.length + sent.length, label: 'Total', color: 'text-slate-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
              <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.num}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-6">
          {[
            { id: 'received',  label: `Received (${received.length})`  },
            { id: 'sent',      label: `Sent (${sent.length})`          },
            { id: 'connected', label: `Connected (${allConnected.length})` },
          ].map(tab => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading requests...</p>
          </div>
        ) : (
          <>
            {/* Received tab */}
            {activeTab === 'received' && (
              received.length === 0 ? (
                <EmptyState
                  icon="📭"
                  title="No requests received yet"
                  subtitle="When students connect with you they'll appear here"
                />
              ) : (
                <>
                  <Section title="Pending — action needed" count={pendingReceived.length}>
                    {pendingReceived.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-yellow-100">
                        <StudentInfo request={r} />
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => handleUpdate(r.id, 'accepted', r.name)}
                            disabled={updating === r.id}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            {updating === r.id ? '...' : 'Accept ✓'}
                          </button>
                          <button
                            onClick={() => handleUpdate(r.id, 'declined', r.name)}
                            disabled={updating === r.id}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            {updating === r.id ? '...' : 'Decline ✗'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </Section>

                  <Section title="Accepted" count={acceptedReceived.length}>
                    {acceptedReceived.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-100">
                        <StudentInfo request={r} />
                        <StatusBadge status="accepted" />
                      </div>
                    ))}
                  </Section>

                  <Section title="Declined" count={declinedReceived.length}>
                    {declinedReceived.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                        <StudentInfo request={r} />
                        <StatusBadge status="declined" />
                      </div>
                    ))}
                  </Section>
                </>
              )
            )}

            {/* Sent tab */}
            {activeTab === 'sent' && (
              sent.length === 0 ? (
                <EmptyState
                  icon="📤"
                  title="No requests sent yet"
                  subtitle="Find students and click Connect to send a request"
                  action={() => navigate('search')}
                  actionLabel="Find Roommates"
                />
              ) : (
                <>
                  <Section title="Pending" count={pendingSent.length}>
                    {pendingSent.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                        <StudentInfo request={r} />
                        <StatusBadge status="pending" />
                      </div>
                    ))}
                  </Section>

                  <Section title="Accepted" count={acceptedSent.length}>
                    {acceptedSent.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-100">
                        <StudentInfo request={r} />
                        <StatusBadge status="accepted" />
                      </div>
                    ))}
                  </Section>

                  <Section title="Declined" count={declinedSent.length}>
                    {declinedSent.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                        <StudentInfo request={r} />
                        <StatusBadge status="declined" />
                      </div>
                    ))}
                  </Section>
                </>
              )
            )}

            {/* Connected tab */}
            {activeTab === 'connected' && (
              allConnected.length === 0 ? (
                <EmptyState
                  icon="🤝"
                  title="No connections yet"
                  subtitle="Accept incoming requests or send one to connect"
                  action={() => navigate('search')}
                  actionLabel="Find Roommates"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {allConnected.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-100">
                      <StudentInfo request={{ ...r, status: 'accepted' }} />
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 font-medium">
                          ✅ Connected
                        </span>
                        <button
                          onClick={() => navigate('search')}
                          className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Requests