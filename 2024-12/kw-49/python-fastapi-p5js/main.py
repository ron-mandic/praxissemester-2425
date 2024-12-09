from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from ollama import chat, ChatResponse
from typing import Literal
from httpx import AsyncClient, Timeout

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    model: str
    messages: list

OLLAMA_API_URL="http://localhost:11434/api/chat"
OLLAMA_API_HEADERS={"Content-Type": "application/json"}

@app.post("/chat")
async def index(request: ChatRequest):
    async with AsyncClient(timeout=Timeout(45.0)) as client:
        payload = {
            "model": request.model,
            "stream": False,
            "messages": request.messages
        }

        response = await client.post(OLLAMA_API_URL, headers=OLLAMA_API_HEADERS, json=payload)
        data = response.json()

    return data

