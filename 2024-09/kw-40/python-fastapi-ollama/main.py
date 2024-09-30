from enum import Enum
import ollama
from fastapi import FastAPI, HTTPException, Path, Query, Depends, status as Status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import requests
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env")
HF_TOKEN = os.getenv("HF_TOKEN")

app = FastAPI()

API_URL = "https://api-inference.huggingface.co/models/openai-community/gpt2"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

