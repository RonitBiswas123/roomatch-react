const BASE_URL = 'https://roommatch-backend-production-3ee2.up.railway.app/api'

const getToken = () => localStorage.getItem('rm_token')

async function request(method, endpoint, body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)
  const response = await fetch(`${BASE_URL}${endpoint}`, options)
  const data     = await response.json()
  if (!response.ok) throw new Error(data.detail || 'Something went wrong')
  return data
}

export const registerUser  = (userData)            => request('POST', '/register', userData)
export const loginUser     = (credentials)         => request('POST', '/login', credentials)
export const getMe         = ()                    => request('GET',  '/me', null, true)
export const createProfile = (userId, profileData) => request('POST', `/profile/${userId}`, profileData, true)
export const getProfile    = (userId)              => request('GET',  `/profile/${userId}`, null, true)
export const getAllUsers    = ()                    => request('GET',  '/users')
export const extractTraits = (text)                => request('POST', '/extract-traits', { text }, true)

export const getStudents = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.branch) params.append('branch', filters.branch)
  if (filters.year)   params.append('year',   filters.year)
  if (filters.gender) params.append('gender', filters.gender)
  const query = params.toString() ? `?${params.toString()}` : ''
  return request('GET', `/students${query}`)
}

export const getRecommendations = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.minScore) params.append('min_score', filters.minScore)
  if (filters.gender)   params.append('gender',    filters.gender)
  if (filters.limit)    params.append('limit',      filters.limit)
  const query = params.toString() ? `?${params.toString()}` : ''
  return request('GET', `/recommendations${query}`, null, true)
}

export const sendRequest   = (receiverId)        => request('POST',  '/requests', { receiver_id: receiverId }, true)
export const getRequests   = ()                  => request('GET',   '/requests', null, true)
export const updateRequest = (requestId, status) => request('PATCH', `/requests/${requestId}`, { status }, true)
export const getAdminStats = () =>
  request('GET', '/admin/stats', null, true)