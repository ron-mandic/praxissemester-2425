from enum import Enum
from fastapi import FastAPI, HTTPException, Path, Query, Depends, status as Status
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from dotenv import load_dotenv
import requests, httpx
import ollama
import os, json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

URL_OLLAMA_GENERATE = "http://localhost:11434/api/generate"
HEADERS = {
    'Content-Type': 'application/json',
}

class PayloadPrompt(BaseModel):
    prompt: str

# @app.post("/chat")
# async def index(payload: PayloadPrompt):
#     def generator():
#         stream = ollama.chat(
#             model='mistral',
#             messages=[{'role': 'user', 'content': payload.prompt}],
#             stream=True,
#         )

#         for chunk in stream:
#             yield json.dumps(chunk) + "\n"

#     return StreamingResponse(generator(), media_type="application/json")

# @app.post("/generate")
# async def index(payload: PayloadPrompt):
#     url = "http://localhost:11434/api/generate"
#     data = {"model": "mistral", "prompt": payload.prompt}

#     stream = requests.post(url, json=data, stream=True)

#     def generator():
#         for chunk in stream.iter_content(chunk_size=1024):
#             yield chunk

#     return StreamingResponse(generator(), media_type="application/json")

# @app.post("/generate")
# async def index(payload: PayloadPrompt):
#     url = "http://localhost:11434/api/generate"
#     data = {"model": "mistral", "prompt": payload.prompt}

#     async with httpx.AsyncClient() as client:
#         response = await client.post(url, json=data)
#         response.raise_for_status()

#         async def generator():
#             for chunk in response.iter_bytes(chunk_size=1024):
#                 yield chunk

#         return StreamingResponse(generator(), media_type="application/json")

@app.post("/generate")
async def generate(payload: PayloadPrompt):
    url = "http://localhost:11434/api/generate"
    data = {"model": "mistral", "prompt": payload.prompt}

    async def generator():
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", url, json=data) as response:
                response.raise_for_status()
                async for chunk in response.aiter_bytes():
                    yield chunk.decode('utf-8')

    return StreamingResponse(generator(), media_type="application/json")