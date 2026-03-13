import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
})

/**
 * Send a chat message to the backend.
 * @param {string} message - User message
 * @param {string|null} sessionId - Session/conversation ID
 * @param {Array} history - Previous messages [{role, content}]
 */
export async function sendMessage(message, sessionId = null, history = []) {
  const { data } = await api.post('/chat', {
    message,
    sessionId,
    history,
  })
  return data
}

/**
 * Fetch chat history for a session.
 */
export async function fetchHistory(sessionId) {
  const { data } = await api.get(`/history/${sessionId}`)
  return data
}

/**
 * Fetch all sessions.
 */
export async function fetchSessions() {
  const { data } = await api.get('/sessions')
  return data
}

/**
 * Delete a session.
 */
export async function deleteSession(sessionId) {
  const { data } = await api.delete(`/sessions/${sessionId}`)
  return data
}

export default api
