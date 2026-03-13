import { useState, useCallback, useRef } from 'react'
import { sendMessage, fetchHistory, fetchSessions, deleteSession } from '../utils/api'
import { nanoid } from '../utils/nanoid'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [sessions, setSessions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const historyRef = useRef([])

  const loadSessions = useCallback(async () => {
    try {
      const data = await fetchSessions()
      setSessions(data.sessions || [])
    } catch {
      // Sessions load fails gracefully
    }
  }, [])

  const selectSession = useCallback(async (id) => {
    try {
      setSessionId(id)
      const data = await fetchHistory(id)
      const msgs = data.messages || []
      setMessages(msgs)
      historyRef.current = msgs.map(m => ({ role: m.role, content: m.content }))
    } catch {
      setError('Failed to load conversation.')
    }
  }, [])

  const newSession = useCallback(() => {
    setSessionId(null)
    setMessages([])
    historyRef.current = []
    setError(null)
  }, [])

  const removeSession = useCallback(async (id) => {
    try {
      await deleteSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
      if (sessionId === id) newSession()
    } catch {}
  }, [sessionId, newSession])

  const send = useCallback(async (text) => {
    if (!text.trim() || isLoading) return

    const userMsg = {
      id: nanoid(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    setError(null)

    const currentHistory = [...historyRef.current]

    try {
      const data = await sendMessage(text, sessionId, currentHistory)

      const aiMsg = {
        id: nanoid(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, aiMsg])
      historyRef.current = [
        ...currentHistory,
        { role: 'user', content: text },
        { role: 'assistant', content: data.reply },
      ]

      // Update session ID if new session was created
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId)
        // Refresh sessions list
        loadSessions()
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Something went wrong.'
      setError(msg)
      // Remove optimistic user message on failure
      setMessages(prev => prev.filter(m => m.id !== userMsg.id))
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, sessionId, loadSessions])

  return {
    messages,
    sessions,
    sessionId,
    isLoading,
    error,
    send,
    newSession,
    selectSession,
    removeSession,
    loadSessions,
  }
}
