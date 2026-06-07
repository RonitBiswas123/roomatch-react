const BASE_URL = 'http://localhost:8000/api'

// ── Helper function ──
async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
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

// ══════════════════════════════
// PROFILE
// ══════════════════════════════
export const createProfile = (userId, profileData) =>
  request('POST', `/profile/${userId}`, profileData)

export const getProfile = (userId) =>
  request('GET', `/profile/${userId}`)

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