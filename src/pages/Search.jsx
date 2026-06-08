import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import FilterBar from '../components/FilterBar'
import { getStudents, sendRequest, getRequests } from '../api'

function Search({ navigate, userProfile, onLogout }) {
  const [students,     setStudents]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [sentRequests, setSentRequests] = useState([])
  const [search,       setSearch]       = useState('')
  const [filterBranch, setFilterBranch] = useState('')
  const [filterYear,   setFilterYear]   = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [sortBy,       setSortBy]       = useState('compatibility')
  const [sending,      setSending]      = useState(null)
  const [toast,        setToast]        = useState('')

  useEffect(() => {
    Promise.all([getStudents(), getRequests()])
      .then(([studentsData, requestsData]) => {
        setStudents(studentsData.students.map(s => ({
          ...s,
          sleepTime:  s.sleep_time,
          wakeTime:   s.wake_time,
          studyHours: s.study_hours,
          compatibility: Math.floor(Math.random() * 40) + 60
        })))
        setSentRequests(requestsData.sent || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSendRequest = async (studentId, studentName) => {
    setSending(studentId)
    try {
      await sendRequest(studentId)
      setSentRequests(prev => [...prev, { receiver_id: studentId, status: 'pending' }])
      showToast(`Request sent to ${studentName}!`)
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

  const filtered = useMemo(() => {
    let result = [...students]
    if (search)       result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    if (filterBranch) result = result.filter(s => s.branch === filterBranch)
    if (filterYear)   result = result.filter(s => String(s.year) === filterYear)
    if (filterGender) result = result.filter(s => s.gender === filterGender)
    if (sortBy === 'compatibility') result.sort((a, b) => b.compatibility - a.compatibility)
    if (sortBy === 'name')          result.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'year')          result.sort((a, b) => a.year - b.year)
    return result
  }, [students, search, filterBranch, filterYear, filterGender, sortBy])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar navigate={navigate} userProfile={userProfile} onLogout={onLogout} />

      {toast && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Find Roommates</h2>
          <p className="text-sm text-slate-400">Search and connect with students who match your habits</p>
        </div>

        <FilterBar
          search={search}             setSearch={setSearch}
          filterBranch={filterBranch} setFilterBranch={setFilterBranch}
          filterYear={filterYear}     setFilterYear={setFilterYear}
          filterGender={filterGender} setFilterGender={setFilterGender}
          sortBy={sortBy}             setSortBy={setSortBy}
        />

        <p className="text-sm text-slate-400 mb-4">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> students
        </p>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading students...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(student => {
              const status = getStatus(student.id)
              return (
                <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">

                  <div
                    className={`h-1.5 ${student.compatibility >= 70 ? 'bg-green-400' : student.compatibility >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${student.compatibility}%` }}
                  />

                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-sm text-slate-400">{student.branch} • Year {student.year}</div>
                        <div className="text-xs text-slate-400">{student.gender}</div>
                      </div>
                      <div className={`text-lg font-bold ${student.compatibility >= 70 ? 'text-green-500' : student.compatibility >= 40 ? 'text-yellow-500' : 'text-red-400'}`}>
                        {student.compatibility}%
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {[student.sleepTime, student.cleanliness, student.noise, student.studyHours]
                        .filter(Boolean)
                        .map((tag, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                            {tag}
                          </span>
                        ))
                      }
                    </div>

                    {student.about && (
                      <p className="text-xs text-slate-400 mb-4 line-clamp-2">{student.about}</p>
                    )}

                    {status === 'pending' ? (
                      <button disabled className="w-full py-2 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-600 text-sm font-medium">
                        ⏳ Request Pending
                      </button>
                    ) : status === 'accepted' ? (
                      <button disabled className="w-full py-2 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm font-medium">
                        ✅ Connected
                      </button>
                    ) : status === 'declined' ? (
                      <button disabled className="w-full py-2 rounded-lg bg-red-50 border border-red-200 text-red-400 text-sm font-medium">
                        ❌ Declined
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(student.id, student.name)}
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
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-medium">No students found</p>
            <p className="text-sm mt-1">Try changing your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search