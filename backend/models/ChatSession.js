import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const ChatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
    },
    messages: [MessageSchema],
    metadata: {
      // Reserved for future: user ID, tags, model used, token counts
      userId: String,
      model: { type: String, default: 'gpt-4o-mini' },
      totalTokens: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
)

// Auto-generate title from first user message
ChatSessionSchema.methods.generateTitle = function () {
  const firstUser = this.messages.find(m => m.role === 'user')
  if (firstUser) {
    this.title = firstUser.content.slice(0, 50) + (firstUser.content.length > 50 ? '...' : '')
  }
}

// Virtual for last message preview
ChatSessionSchema.virtual('lastMessage').get(function () {
  return this.messages[this.messages.length - 1] || null
})

export default mongoose.model('ChatSession', ChatSessionSchema)
