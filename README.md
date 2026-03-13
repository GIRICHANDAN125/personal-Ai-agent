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

## Quick Start

### 1. MongoDB Atlas Setup
1. Create free account at https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Whitelist your IP (Network Access → Add IP)
5. Copy the connection string (Connect → Drivers → Node.js)

### 2. Environment Variables

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/neural-chat?retryWrites=true&w=majority
AI_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

**ai-service/.env**
```env
OPENAI_API_KEY=sk-...your-openai-key...
MODEL_NAME=gpt-4o-mini
MAX_TOKENS=2048
TEMPERATURE=0.7
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install & Run

**Terminal 1 — AI Service (Python)**
```bash
cd ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Backend (Node.js)**
```bash
cd backend
npm install
cp .env.example .env            # then fill in your values
npm run dev
```

**Terminal 3 — Frontend (React)**
```bash
cd frontend
npm install
cp .env.example .env            # optional, defaults to localhost
npm run dev
```

Open http://localhost:3000 🎉

---

## API Reference

### Node.js Backend (port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message, get AI reply |
| GET | `/api/history/:sessionId` | Get session messages |
| GET | `/api/sessions` | List all sessions |
| DELETE | `/api/sessions/:sessionId` | Delete a session |
| GET | `/api/health` | Health check |

### Python AI Service (port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | LLM call |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI (auto-generated) |

---

## Upgrading to RAG / Tools

**Add vector search (RAG):**
1. `pip install chromadb` or use MongoDB Atlas Vector Search
2. Embed user query → retrieve relevant docs
3. Pass `context` to `llm_service.chat()`

**Add tools/function calling:**
1. Define tool schemas in `llm_service.build_tools()`
2. Implement tool executors
3. Handle `tool_calls` in `llm_service.chat()`

**Switch to GPT-4o:**
```
MODEL_NAME=gpt-4o
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Three.js, React Three Fiber |
| Backend | Node.js, Express, Mongoose, Axios |
| AI Service | Python, FastAPI, OpenAI SDK |
| Database | MongoDB Atlas (free tier) |
| 3D | React Three Fiber, Three.js, @react-three/drei |
