from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from ollama import chat
from ollama import ChatResponse

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    content: str

class ChatResponseModel(BaseModel):
    message: str

@app.post("/chat", response_model=ChatResponseModel)
async def ask(request: MessageRequest):
    response: ChatResponse = chat(model='mistral:latest', messages=[
        {
            'role': 'user',
            'content': request.content,
        },
    ])
    
    message = response.message
    return ChatResponseModel(message=message)

