# 🧠 NeuralChat — Full-Stack AI Chat Application

React → Node.js → Python FastAPI → OpenAI → MongoDB Atlas

---

## Architecture

```
Browser (React + Vite)
    │  HTTP POST /api/chat
    ▼
Node.js Express (port 5000)      ← handles CORS, DB, orchestration
    │  HTTP POST /chat
    ▼
Python FastAPI (port 8000)       ← LLM calls, tool use, RAG-ready
    │  OpenAI API
    ▼
GPT-4o-mini / GPT-4o             ← LLM
    
MongoDB Atlas                    ← stores chat sessions & history
```

---

## Project Structure

```
ai-fullstack-agent/
├── frontend/                    # React + Vite + Tailwind + Three.js
│   ├── src/
│   │   ├── App.jsx              # Main layout
│   │   ├── components/
│   │   │   ├── AIOrb.jsx        # 3D animated background (React Three Fiber)
│   │   │   ├── ChatMessage.jsx  # Message bubbles with animations
│   │   │   ├── ChatInput.jsx    # Textarea with send button
│   │   │   └── Sidebar.jsx      # Session history sidebar
│   │   ├── hooks/
│   │   │   └── useChat.js       # Chat state management
│   │   └── utils/
│   │       ├── api.js           # Axios API calls
│   │       └── nanoid.js        # ID generator
│   └── package.json
│
├── backend/                     # Node.js Express API
│   ├── models/
│   │   └── ChatSession.js       # Mongoose schema
│   ├── routes/
│   │   └── chat.js              # API endpoints
│   ├── server.js                # Express entry point
│   └── package.json
│
└── ai-service/                  # Python FastAPI AI agent
    ├── main.py                  # FastAPI app + /chat endpoint
    ├── llm_service.py           # OpenAI calls, message building
    ├── config.py                # Settings, Pydantic models
    └── requirements.txt
```

---


### Python AI Service (port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | LLM call |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI (auto-generated) |

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Three.js, React Three Fiber |
| Backend | Node.js, Express, Mongoose, Axios |
| AI Service | Python, FastAPI, OpenAI SDK |
| Database | MongoDB Atlas (free tier) |
| 3D | React Three Fiber, Three.js, @react-three/drei |
