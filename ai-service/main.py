"""
main.py — FastAPI AI service entry point.

Run:  uvicorn main:app --reload --port 8000
"""
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config import ChatRequest, ChatResponse, MODEL_NAME
from llm_service import chat

# ── Setup logging ──────────────────────────────────────────────────
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NeuralChat AI Service",
    description="Python FastAPI AI agent — connects to OpenAI, ready for RAG and tools.",
    version="1.0.0",
)

# CORS — allow Node backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000","https://chandu-backend.onrender.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL_NAME}


# ─── Chat endpoint ────────────────────────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """
    Receive a message + history, return an AI-generated reply.

    Request body:
        message   : str          — current user message
        history   : list[dict]   — [{role, content}, ...] previous turns
        session_id: str | None   — passed through for future use

    Response:
        reply  : str   — AI response text
        model  : str   — which model responded
        usage  : dict  — token counts
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    history_dicts = [{"role": m.role, "content": m.content} for m in req.history]

    try:
        logger.info(f"📨 Chat request received: {len(req.message)} chars, {len(req.history)} history items")
        result = await chat(
            user_message=req.message,
            history=history_dicts,
        )
        logger.info(f"✅ Chat response generated successfully")
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        logger.error(f"❌ Chat endpoint error: {error_msg}")
        # Surfaces OpenAI errors (rate limit, invalid key, etc.) to caller
        raise HTTPException(status_code=502, detail=error_msg)

    return ChatResponse(
        reply=result["reply"],
        model=result["model"],
        usage=result.get("usage"),
    )


# ─── Run directly ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
