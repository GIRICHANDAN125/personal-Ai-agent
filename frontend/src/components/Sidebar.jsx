import { motion } from 'framer-motion'
import { MessageSquare, Trash2, Clock } from 'lucide-react'

export default function Sidebar({ sessions, activeId, onSelect, onNew, onDelete }) {
  return (
    <div className="glass-strong h-full flex flex-col border-r border-border/50 w-64 flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-mono text-slate-400 tracking-[0.2em] uppercase">History</span>
        </div>
        <button
          onClick={onNew}
          className="w-full py-2 px-3 rounded-xl bg-accent/10 border border-accent/20 
                     text-accent text-xs font-medium hover:bg-accent/20 hover:border-accent/40
                     transition-all duration-200 flex items-center gap-2"
        >
          <MessageSquare size={12} />
          New Conversation
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 && (
          <div className="text-center text-slate-600 text-xs p-4 font-light">
            No conversations yet
          </div>
        )}
        {sessions.map((session) => (
          <motion.button
            key={session.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onSelect(session.id)}
            className={`
              w-full text-left px-3 py-2.5 rounded-xl group transition-all duration-200
              flex items-start gap-2 text-xs
              ${activeId === session.id
                ? 'bg-accent/10 border border-accent/20 text-slate-200'
                : 'hover:bg-white/5 border border-transparent text-slate-500 hover:text-slate-300'
              }
            `}
          >
            <MessageSquare size={11} className="flex-shrink-0 mt-0.5 opacity-60" />
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{session.title || 'New Chat'}</p>
              <div className="flex items-center gap-1 mt-0.5 opacity-60">
                <Clock size={9} />
                <span className="font-mono" style={{ fontSize: '10px' }}>
                  {new Date(session.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(session.id) }}
              className="opacity-0 group-hover:opacity-100 text-red-500/60 hover:text-red-400
                         transition-all duration-200 p-0.5 rounded"
            >
              <Trash2 size={10} />
            </button>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <p className="text-[10px] font-mono text-slate-700 text-center tracking-wider">
          POWERED BY GROQ AI
        </p>
      </div>
    </div>
  )
}