from enum import Enum
from fastapi import FastAPI, HTTPException, Path, Query, Depends, status as Status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from dotenv import load_dotenv
import requests
import ollama
import os

app = FastAPI()