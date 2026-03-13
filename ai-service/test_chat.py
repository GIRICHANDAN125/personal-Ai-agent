"""
test_chat.py - Simple test script for /chat endpoint
"""
import asyncio
import httpx
import json

async def test_chat():
    """Test the /chat endpoint"""
    payload = {
        "message": "What is machine learning?",
        "history": []
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8000/chat",
                json=payload,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        except Exception as e:
            print(f"Error: {type(e).__name__}: {e}")

if __name__ == "__main__":
    asyncio.run(test_chat())
