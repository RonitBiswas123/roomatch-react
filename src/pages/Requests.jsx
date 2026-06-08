import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getRequests, updateRequest } from '../api'

function Requests({ navigate, userProfile, onLogout }) {
  const [sent,      setSent]      = useState([])
  const [received,  setReceived]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [activeTab, setActiveTab] = useState('received')
  const [updating,  setUpdating]  = useState(null)
  const [toast,     setToast]     = useState('')

  useEffect(() => {
    getRequests()
      .then(data => {
        setSent(data.sent || [])
        setReceived(data.received || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleUpdate = async (requestId, status, name) => {
    setUpdating(requestId)
    try {
      await updateRequest(requestId, status)
      setReceived(prev =>
        prev.map(r => r.id === requestId ? { ...r, status } : r)
      )
      showToast(status === 'accepted'
        ? `Connected with ${name}! 🎉`
        : `Request from ${name} declined`)
    } catch (err) {
      showToast(err.message)
    } finally {
      setUpdating(null)
    }
  }

  const pendingReceived  = received.filter(r => r.status === 'pending')
  const acceptedReceived = received.filter(r => r.status === 'accepted')
  const pendingSent      = sent.filter(r => r.status === 'pending')
  const acceptedSent     = sent.filter(r => r.status === 'accepted')
  const declinedSent     = sent.filter(r => r.status === 'declined')

  const StatusBadge = ({ status }) => {
    const styles = {
      pending:  'bg-yellow-50 text-yellow-600 border border-yellow-200',
      accepted: 'bg-green-50 text-green-600 border border-green-200',
      declined: 'bg-red-50 text-red-400 border border-red-200',
    }
    const icons = { pending: '⏳', accepted: '✅', declined: '❌' }
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const StudentRow = ({ request, showActions = false }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
          {request.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-slate-900 text-sm">{request.name}</div>
          <div className="text-xs text-slate-400">{request.branch} • Year {request.year} • {request.gender}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showActions && request.status === 'pending' ? (
          <>
            <button
              onClick={() => handleUpdate(request.id, 'accepted', request.name)}
              disabled={updating === request.id}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {updating === request.id ? '...' : 'Accept'}
            </button>
            <button
              onClick={() => handleUpdate(request.id, 'declined', request.name)}
              disabled={updating === request.id}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {updating === request.id ? '...' : 'Decline'}
            </button>
          </>
        ) : (
          <StatusBadge status={request.status} />
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} onLogout={onLogout} />

      {toast && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Roommate Requests</h2>
          <p className="text-sm text-slate-400">Manage your incoming and outgoing roommate requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { num: pendingReceived.length,  label: 'Pending Received', color: 'text-yellow-500' },
            { num: acceptedReceived.length + acceptedSent.length, label: 'Connected', color: 'text-green-500' },
            { num: pendingSent.length,      label: 'Requests Sent',    color: 'text-blue-500'   },
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
            { id: 'received', label: `Received (${received.length})` },
            { id: 'sent',     label: `Sent (${sent.length})` },
            { id: 'connected', label: `Connected (${acceptedReceived.length + acceptedSent.length})` },
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
              <div className="flex flex-col gap-3">
                {received.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <p className="text-3xl mb-3">📭</p>
                    <p className="font-medium">No requests received yet</p>
                    <p className="text-sm mt-1">When students connect with you they'll appear here</p>
                  </div>
                ) : (
                  <>
                    {pendingReceived.length > 0 && (
                      <>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Pending — {pendingReceived.length}
                        </p>
                        {pendingReceived.map(r => (
                          <StudentRow key={r.id} request={r} showActions={true} />
                        ))}
                      </>
                    )}
                    {acceptedReceived.length > 0 && (
                      <>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-4">
                          Accepted — {acceptedReceived.length}
                        </p>
                        {acceptedReceived.map(r => (
                          <StudentRow key={r.id} request={r} />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Sent tab */}
            {activeTab === 'sent' && (
              <div className="flex flex-col gap-3">
                {sent.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <p className="text-3xl mb-3">📤</p>
                    <p className="font-medium">No requests sent yet</p>
                    <button
                      onClick={() => navigate('search')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Find Roommates
                    </button>
                  </div>
                ) : (
                  <>
                    {pendingSent.length > 0 && (
                      <>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Pending — {pendingSent.length}
                        </p>
                        {pendingSent.map(r => <StudentRow key={r.id} request={r} />)}
                      </>
                    )}
                    {acceptedSent.length > 0 && (
                      <>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-4">
                          Accepted — {acceptedSent.length}
                        </p>
                        {acceptedSent.map(r => <StudentRow key={r.id} request={r} />)}
                      </>
                    )}
                    {declinedSent.length > 0 && (
                      <>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-4">
                          Declined — {declinedSent.length}
                        </p>
                        {declinedSent.map(r => <StudentRow key={r.id} request={r} />)}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Connected tab */}
            {activeTab === 'connected' && (
              <div className="flex flex-col gap-3">
                {acceptedReceived.length === 0 && acceptedSent.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <p className="text-3xl mb-3">🤝</p>
                    <p className="font-medium">No connections yet</p>
                    <p className="text-sm mt-1">Accept requests or send one to connect</p>
                  </div>
                ) : (
                  <>
                    {[...acceptedReceived, ...acceptedSent].map(r => (
                      <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center">
                            {r.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{r.name}</div>
                            <div className="text-xs text-slate-400">{r.branch} • Year {r.year}</div>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 font-medium">
                          ✅ Connected
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Requests