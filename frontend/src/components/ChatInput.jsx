import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
    }
  }

  const hasValue = value.trim().length > 0

  return (
    <div className="relative">
      {/* Glow line above input */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="glass-strong p-4">
        <div className="gradient-border rounded-2xl">
          <div className="relative flex items-end gap-3 bg-void/50 rounded-2xl px-4 py-3">
            {/* Sparkle icon */}
            <Sparkles
              size={16}
              className="flex-shrink-0 mb-1 text-accent/40"
            />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              disabled={disabled}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-200
                         placeholder-slate-600 font-light leading-relaxed min-h-[24px]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ maxHeight: '160px' }}
            />

            {/* Send button */}
            <AnimatePresence>
              <motion.button
                onClick={handleSubmit}
                disabled={!hasValue || disabled}
                whileTap={{ scale: 0.9 }}
                className={`
                  flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                  transition-all duration-300 mb-0.5
                  ${hasValue && !disabled
                    ? 'bg-gradient-to-br from-accent to-accent2 text-white shadow-lg shadow-accent/25 hover:shadow-accent/40'
                    : 'bg-surface border border-border text-slate-600 cursor-not-allowed'
                  }
                `}
              >
                {disabled ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <Send size={13} />
                )}
              </motion.button>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-2 font-mono tracking-wider">
          SHIFT+ENTER for new line · ENTER to send
        </p>
      </div>
    </div>
  )
}
