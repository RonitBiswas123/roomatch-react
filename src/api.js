const BASE_URL = 'http://localhost:8000/api'

// ── Get token from localStorage ──
const getToken = () => localStorage.getItem('rm_token')

// ── Helper function ──
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

  if (!response.ok) {
    throw new Error(data.detail || 'Something went wrong')
  }

  return data
}

// ══════════════════════════════
// AUTH
// ══════════════════════════════
export const registerUser = (userData) =>
  request('POST', '/register', userData)

export const loginUser = (credentials) =>
  request('POST', '/login', credentials)

export const getMe = () =>
  request('GET', '/me', null, true)

// ══════════════════════════════
// PROFILE
// ══════════════════════════════
export const createProfile = (userId, profileData) =>
  request('POST', `/profile/${userId}`, profileData, true)

export const getProfile = (userId) =>
  request('GET', `/profile/${userId}`, null, true)

// ══════════════════════════════
// STUDENTS
// ══════════════════════════════
export const getStudents = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.branch) params.append('branch', filters.branch)
  if (filters.year)   params.append('year',   filters.year)
  if (filters.gender) params.append('gender', filters.gender)
  const query = params.toString() ? `?${params.toString()}` : ''
  return request('GET', `/students${query}`)
}

export const getAllUsers = () =>
  request('GET', '/users')
// ══════════════════════════════
// REQUESTS
// ══════════════════════════════
export const sendRequest = (receiverId) =>
  request('POST', '/requests', { receiver_id: receiverId }, true)

export const getRequests = () =>
  request('GET', '/requests', null, true)

export const updateRequest = (requestId, status) =>
  request('PATCH', `/requests/${requestId}`, { status }, true)

export const getRecommendations = () =>
  request('GET', '/recommendations', null, true)