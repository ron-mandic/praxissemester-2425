from enum import Enum
from fastapi import FastAPI, HTTPException, Path, Query, Depends, status as Status
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Literal, Optional, Sequence, Union
from dotenv import load_dotenv
from ollama import AsyncClient, Message, Options
import ollama
import requests, httpx
import os, json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_MODEL = "llama3.2-vision:11b"
URL_OLLAMA_CHAT = "http://localhost:11434/api/chat"
HEADERS = {
    'Content-Type': 'application/json',
}

class PayloadPrompt(BaseModel):
    prompt: str

class PayloadChat(BaseModel):
    messages: Sequence[Message] | None = None
    options: Optional[Options] | None = None
    content_system: str = None

# ############################################################################### Chat
# @app.post("/chat")
# async def index(payload: PayloadChat):
#     async def generator():
#         async for chunk in await AsyncClient().chat(model='mistral', messages=payload.messages, options={"seed": 1}, stream=True):
#             yield json.dumps(chunk) + "\n"

#     return StreamingResponse(generator(), media_type="application/json")
@app.post("/chat")
async def index(payload: PayloadChat):
    messages = payload.messages
    content_system = payload.content_system

    data = {
        "model": OLLAMA_MODEL,
        "messages": messages if content_system is None else [{"role": "system", "content": content_system}] + messages,
        "options": payload.options
    }

    async def generator():
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", URL_OLLAMA_CHAT, headers=HEADERS, json=data) as response:
                response.raise_for_status()
                async for chunk in response.aiter_bytes():
                    yield chunk.decode('utf-8')

    return StreamingResponse(generator(), media_type="application/json")
