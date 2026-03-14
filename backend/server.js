import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import chatRoutes from './routes/chat.js'

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || 
        origin.includes('vercel.app') || 
        origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ChanduChat Backend running', port: PORT })
})

app.use('/api', chatRoutes)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[Express] Error:', err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' })
})

// ── MongoDB + start ───────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neural-chat'

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => {
      console.log(`🚀 ChanduChat Backend running at http://localhost:${PORT}`)
      startKeepAlive()
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    app.listen(PORT, () => {
      console.log(`⚠️  Backend running WITHOUT DB at http://localhost:${PORT}`)
      startKeepAlive()
    })
  })

// ── Keep alive (prevent Render free tier sleep) ────────────────────────────
function startKeepAlive() {
  const BACKEND_URL = 'https://chandu-backend.onrender.com'
  const AI_URL = 'https://ai-service-7pie.onrender.com/health'

  setInterval(async () => {
    try {
      await fetch(BACKEND_URL)
      await fetch(AI_URL)
      console.log('✅ Keep alive ping sent')
    } catch (e) {
      console.log('⚠️ Keep alive failed:', e.message)
    }
  }, 14 * 60 * 1000) // every 14 minutes

  console.log('🔄 Keep alive started')
}