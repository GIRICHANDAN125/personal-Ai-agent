import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Menu, X, AlertCircle, Zap } from 'lucide-react'
import AIOrb from './components/AIOrb'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import Sidebar from './components/Sidebar'
import { useChat } from './hooks/useChat'

export default function App() {
  const {
    messages, sessions, sessionId, isLoading, error,
    send, newSession, selectSession, removeSession, loadSessions,
  } = useChat()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const isEmpty = messages.length === 0

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-void noise">
      {/* 3D Background Orb */}
      <AIOrb isThinking={isLoading} />

      {/* Dark overlay to make chat readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(2,4,8,0.7) 100%)',
          zIndex: 1,
        }}
      />

      {/* App shell */}
      <div className="relative flex h-full" style={{ zIndex: 2 }}>
        {/* Sidebar - desktop */}
        <div className="hidden lg:flex">
          <Sidebar
            sessions={sessions}
            activeId={sessionId}
            onSelect={(id) => { selectSession(id); setSidebarOpen(false) }}
            onNew={newSession}
            onDelete={removeSession}
          />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
                style={{ zIndex: 10 }}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 lg:hidden"
                style={{ zIndex: 11 }}
              >
                <Sidebar
                  sessions={sessions}
                  activeId={sessionId}
                  onSelect={(id) => { selectSession(id); setSidebarOpen(false) }}
                  onNew={() => { newSession(); setSidebarOpen(false) }}
                  onDelete={removeSession}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Top bar */}
          <div className="glass-strong flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-accent transition-colors"
              >
                <Menu size={18} />
              </button>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Brain size={18} className="text-accent" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-glow animate-pulse" />
                </div>
                <span className="font-semibold text-sm tracking-wide bg-gradient-to-r from-accent to-glow bg-clip-text text-transparent">
                  Chandu
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-accent/70"
                >
                  <Zap size={10} className="animate-pulse" />
                  PROCESSING
                </motion.div>
              )}
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <AnimatePresence>
              {isEmpty && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center gap-4 pb-16"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent2/20
                                    border border-accent/20 flex items-center justify-center">
                      <Brain size={28} className="text-accent" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-glow/20
                                    border border-glow/30 flex items-center justify-center">
                      <Zap size={10} className="text-glow" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                      How can I help you today?
                    </h2>
                    <p className="text-slate-600 text-sm mt-1 font-light">
                      Start a conversation — I'm connected to Groq AI
                    </p>
                  </div>

                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-2 justify-center max-w-sm mt-2">
                    {[
                      'Explain quantum computing',
                      'Write a Python script',
                      'Summarize a concept',
                      'Help me brainstorm',
                    ].map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="px-3 py-1.5 rounded-lg glass border border-border hover:border-accent/30
                                   text-xs text-slate-400 hover:text-accent transition-all duration-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <ChatMessage
                      message={{ role: 'assistant', content: '' }}
                      isTyping
                    />
                  )}

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-xs text-red-400/80 bg-red-500/10
                                 border border-red-500/20 rounded-xl px-4 py-2.5 max-w-md mx-auto"
                    >
                      <AlertCircle size={12} />
                      {error}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="max-w-3xl mx-auto w-full px-4 pb-2">
            <ChatInput onSend={send} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}