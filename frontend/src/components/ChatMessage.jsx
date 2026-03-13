import { motion } from 'framer-motion'
import { Bot, User, Copy, Check } from 'lucide-react'
import { useState } from 'react'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-0.5">
      <div className="w-1.5 h-1.5 rounded-full bg-accent typing-dot" />
      <div className="w-1.5 h-1.5 rounded-full bg-accent typing-dot" />
      <div className="w-1.5 h-1.5 rounded-full bg-accent typing-dot" />
    </div>
  )
}

export default function ChatMessage({ message, isTyping = false }) {
  const [copied, setCopied] = useState(false)
  const isUser = message?.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser
          ? 'bg-gradient-to-br from-accent2 to-accent border border-accent/30'
          : 'bg-gradient-to-br from-accent/20 to-glow/10 border border-accent/30'
        }
      `}>
        {isUser
          ? <User size={14} className="text-white" />
          : <Bot size={14} className="text-accent" />
        }
      </div>

      {/* Bubble */}
      <div className={`relative max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`
          relative px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-gradient-to-br from-accent2/25 to-accent/15 border border-accent2/30 text-slate-100 rounded-tr-sm'
            : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm'
          }
        `}>
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <p className="whitespace-pre-wrap font-light tracking-wide" style={{ lineHeight: '1.7' }}>
              {message?.content}
            </p>
          )}

          {/* Copy button */}
          {!isTyping && !isUser && (
            <button
              onClick={handleCopy}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-200
                         flex items-center justify-center opacity-0 group-hover:opacity-100
                         transition-all duration-200 hover:border-accent/40 hover:text-accent text-gray-400"
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
          )}
        </div>

        {/* Timestamp */}
        {message?.timestamp && (
          <span className="text-[10px] text-slate-600 px-1 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </motion.div>
  )
}