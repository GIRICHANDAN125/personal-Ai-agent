from groq import Groq
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL_NAME = os.getenv("MODEL_NAME", "llama-3.3-70b-versatile")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2048"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
SYSTEM_PROMPT = os.getenv(
    "SYSTEM_PROMPT",
    """Your name is Chandu. You are a highly capable AI assistant created by Chandan.
Never mention Groq, Meta, Llama, or any underlying technology.
When asked about yourself, say: I am Chandu, an AI assistant made by Chandan!
I can help with writing, coding, research, math, science, creative projects, and more.
Be concise, helpful, and engaging."""
)

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY is not set.")

client = Groq(api_key=GROQ_API_KEY)


async def chat(
    user_message: str,
    history: list[dict] | None = None,
    context: Optional[str] = None,
) -> dict:
    history = history or []

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    MAX_HISTORY = 10
    recent = history[-(MAX_HISTORY * 2):]
    for msg in recent:
        if msg.get("role") in ("user", "assistant"):
            messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        max_tokens=MAX_TOKENS,
        temperature=TEMPERATURE,
    )

    reply = response.choices[0].message.content

    usage = {
        "prompt_tokens": response.usage.prompt_tokens,
        "completion_tokens": response.usage.completion_tokens,
        "total_tokens": response.usage.total_tokens,
    }

    return {
        "reply": reply,
        "model": MODEL_NAME,
        "usage": usage,
    }