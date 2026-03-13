import express from 'express'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import ChatSession from '../models/ChatSession.js'

const router = express.Router()

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

// ─── POST /api/chat ───────────────────────────────────────────────────────────
// Receives: { message, sessionId?, history? }
// Returns:  { reply, sessionId }
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, history = [] } = req.body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' })
    }

    // ── 1. Forward to Python AI service ──────────────────────────────────────
    let reply
    try {
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/chat`,
        { message: message.trim(), history },
        { timeout: 55000 }
      )
      reply = aiResponse.data.reply
    } catch (aiErr) {
      const detail = aiErr?.response?.data?.detail || aiErr.message
      console.error('[Backend] AI service error:', detail)
      return res.status(502).json({ error: `AI service unavailable: ${detail}` })
    }

    // ── 2. Persist to MongoDB ─────────────────────────────────────────────────
    let session
    const sid = sessionId || uuidv4()

    try {
      session = await ChatSession.findOne({ sessionId: sid })

      if (!session) {
        session = new ChatSession({ sessionId: sid, messages: [] })
      }

      session.messages.push(
        { role: 'user', content: message.trim() },
        { role: 'assistant', content: reply }
      )

      // Generate title from first message
      if (session.messages.length <= 2) {
        session.generateTitle()
      }

      await session.save()
    } catch (dbErr) {
      // DB error is non-fatal — still return AI response
      console.error('[Backend] DB write error:', dbErr.message)
    }

    return res.json({ reply, sessionId: sid })
  } catch (err) {
    console.error('[Backend] Unhandled error:', err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
})

// ─── GET /api/history/:sessionId ─────────────────────────────────────────────
router.get('/history/:sessionId', async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId })
    if (!session) return res.status(404).json({ error: 'Session not found.' })
    return res.json({ messages: session.messages, title: session.title })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/sessions ───────────────────────────────────────────────────────
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await ChatSession.find({}, {
      sessionId: 1, title: 1, createdAt: 1, updatedAt: 1, 'messages': { $slice: -1 }
    }).sort({ updatedAt: -1 }).limit(50)

    const formatted = sessions.map(s => ({
      id: s.sessionId,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      preview: s.messages?.[0]?.content?.slice(0, 60),
    }))

    return res.json({ sessions: formatted })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// ─── DELETE /api/sessions/:sessionId ────────────────────────────────────────
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    await ChatSession.deleteOne({ sessionId: req.params.sessionId })
    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/health ─────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
