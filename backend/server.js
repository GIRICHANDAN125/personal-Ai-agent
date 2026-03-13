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
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'NeuralChat Backend running', port: PORT })
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
      console.log(`🚀 Backend running at http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    // Start server anyway so AI still works without DB
    app.listen(PORT, () => {
      console.log(`⚠️  Backend running WITHOUT DB at http://localhost:${PORT}`)
    })
  })
