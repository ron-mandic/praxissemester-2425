from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from ollama import chat, ChatResponse, AsyncClient
from typing import Literal

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    model: str
    content: str

class ChatResponseModel(BaseModel):
    role: Literal["assistant"]
    message: str

@app.post("/chat", response_model=ChatResponseModel)
async def ask(request: MessageRequest):
    async with AsyncClient() as client:
        response = await client.chat(model=request.model, messages=request.messages, stream=False)
    return ChatResponseModel(message=response.message)

