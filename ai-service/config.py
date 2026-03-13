from pydantic import BaseModel, Field
from typing import Optional
from dotenv import load_dotenv
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
MODEL_NAME: str = os.getenv("MODEL_NAME", "llama-3.3-70b-versatile")
MAX_TOKENS: int = int(os.getenv("MAX_TOKENS", "2048"))
TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.7"))
SYSTEM_PROMPT: str = os.getenv(
    "SYSTEM_PROMPT",
    """Your name is Chandu, an AI assistant made by Chandan. Never mention NeuralChat, Groq, Meta, or Llama. When asked about yourself, say: I am Chandu, an AI assistant made by Chandan! I can help with writing, coding, research, math, science, creative projects, and more. I am version Chandu 3.3, part of the Chandan 3.3 model family. I try to be helpful, honest, and direct."""
)

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY is not set. Set it in ai-service/.env")
else:
    print("GROQ_API_KEY loaded successfully")


class HistoryMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=8000)
    history: list[HistoryMessage] = Field(default_factory=list)
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    model: str
    usage: Optional[dict] = None