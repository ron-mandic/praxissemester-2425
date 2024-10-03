from enum import Enum
from fastapi import FastAPI, HTTPException, Path, Query, Depends, status as Status
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Literal, Optional, Sequence, Union
from dotenv import load_dotenv
from ollama import AsyncClient, Message, Options
from sklearn.manifold import TSNE
import numpy as np
import requests, httpx
import ollama
import os, json
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch.nn.functional as F
import torch
import platform

from lib.functions import normalize, normalize_coords

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

URL_OLLAMA_GENERATE = "http://localhost:11434/api/generate"
URL_OLLAMA_EMBED = "http://localhost:11434/api/embed"
URL_OLLAMA_EMBEDDINGS = URL_OLLAMA_EMBED + "dings"
URL_OLLAMA_CHAT = "http://localhost:11434/api/chat"
HEADERS = {
    'Content-Type': 'application/json',
}

class PayloadInput(BaseModel):
    input: str

class PayloadInput(BaseModel):
    input: Union[str, List[str]]

class TSNEParams(BaseModel):
    learning_rate: Union[float, Literal['auto']] = "auto"
    max_iter: Optional[int] = 1000 # former n_iter
    init: Literal['random', 'pca'] = "pca"
    random_state: Optional[int] = None # only works with "init": "random"
    verbose: Literal[0, 1] = 0

class PayloadInputTSNE(BaseModel):
    input: Union[str, List[str]]
    params: Optional[TSNEParams] = None

class PayloadPrompt(BaseModel):
    prompt: str

class PayloadChat(BaseModel):
    messages: Sequence[Message] | None = None
    options: Optional[Options] | None = None # Does not work in CLI nor in modelfiles

tokenizer = AutoTokenizer.from_pretrained("openai-community/gpt2")
model = AutoModelForCausalLM.from_pretrained("openai-community/gpt2")

@app.get("/test")
async def index():
    # 1
    # prompt = "The sky is "
    # inputs = tokenizer(prompt, return_tensors="pt")
    # outputs = model(**inputs, labels=inputs["input_ids"])
    
    # logits = outputs.logits[-1, -1, :]
    # print(logits.shape)

    # temperature = 0.00000001

    # scaled_logits = logits / temperature
    # probabilities = F.softmax(scaled_logits, dim=-1)
    # print(probabilities)

    # num_samples = 5
    # samples = torch.multinomial(probabilities, num_samples=num_samples)

    # decoded_samples = [tokenizer.decode(sample) for sample in samples]

    # return {
    #     "samples": decoded_samples
    # }

    # 2
    # prompt = "The sky is blue or"

    # # Tokenisieren des Prompts
    # inputs = tokenizer(prompt, return_tensors="pt")

    # # Vorwärtsdurchlauf des Modells
    # outputs = model(**inputs)

    # # Logits: [Batch Size, Sequence Length, Vocab Size]
    # logits = outputs.logits
    # print("Logits shape:", logits.shape)  # Ausgabe: torch.Size([1, 5, 50257]) ([Batch Size, Sequence Length, Vocab Size])

    # # Extrahiere die Logits des letzten Tokens in der Sequenz
    # # Da logits die Form [1, 5, 50257] haben, brauchen wir die Logits des letzten Tokens, also Index -1
    # last_token_logits = logits[:, -1, :]
    # print("Logits of the last token:", last_token_logits.shape)  # Ausgabe: torch.Size([1, 50257])

    # # Temperatur einstellen für Wahrscheinlichkeitsverteilung
    # temperature = 0.7
    # scaled_logits = last_token_logits / temperature

    # # Wahrscheinlichkeiten mit Softmax berechnen
    # probabilities = F.softmax(scaled_logits, dim=-1)

    # # Die 5 wahrscheinlichsten Tokens finden
    # num_samples = 5
    # top_probs, top_indices = torch.topk(probabilities, num_samples)

    # # Dekodiere die Token-Indices zu lesbarem Text
    # decoded_samples = [tokenizer.decode(index.item()) for index in top_indices[0]]

    # # Ausgabe
    # print("Top 5 predictions:", decoded_samples)
    # print("Probabilities:", top_probs)

    # 3
    prompt = "The earth is "

    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = model(**inputs)

    logits = outputs.logits

    last_token_logits = logits[:, -1, :]
    
    temperature = 0.00001
    scaled_logits = last_token_logits / temperature

    probabilities = F.softmax(scaled_logits, dim=-1)

    num_samples = 5
    top_probs, top_indices = torch.topk(probabilities, num_samples)

    decoded_samples = [tokenizer.decode(index.item()) for index in top_indices[0]]

    logit_values = [scaled_logits[0, index].item() for index in top_indices[0]]
    probability_values = [prob.item() for prob in top_probs[0]]

    return {
        "predictions": decoded_samples,
        "logits": logit_values,
        "probabilities": probability_values
    }

# ############################################################################### Embeddings

# @app.post("/embed")
# async def index(payload: PayloadInput):
#     return ollama.embed(model='mistral', input=payload.input)
@app.post("/embed")
async def index(payload: PayloadInput):
    """It is assumed that the model is only Mistral, so no need to both specify model and input for now"""
    data = {"model": "mistral", "input": payload.input}
    async with httpx.AsyncClient() as client:
        response = await client.post(URL_OLLAMA_EMBED, headers=HEADERS, json=data)
        return response.json()
    
# ############################################################################### Visualize
# TODO: Implement euclidian distance / cosinus similarity in the frontend
@app.post("/tsne")
async def index(payload: PayloadInputTSNE):
    """It is assumed that the model is only Mistral, so no need to both specify model and input for now"""
    data = {"model": "mistral", "input": payload.input}
    async with httpx.AsyncClient() as client:
        response = await client.post(URL_OLLAMA_EMBED, headers=HEADERS, json=data)
        response_data = response.json()

    embeddings = np.array(response_data["embeddings"])
    tsne = TSNE(
        perplexity=min(30, embeddings.shape[0] - 1),
        **payload.params.model_dump()
    )
    coords = tsne.fit_transform(embeddings)

    return {"input": payload.input, "coordinates": normalize_coords(coords)}

# ############################################################################### Prompt

# @app.post("/generate")
# async def index(payload: PayloadPrompt):
#     async def generator():
#         async for chunk in await AsyncClient().generate(model='mistral', prompt=payload.prompt, stream=True):
#             yield json.dumps(chunk) + "\n"

#     return StreamingResponse(generator(), media_type="application/json")
@app.post("/generate")
async def index(payload: PayloadPrompt):
    data = {"model": "mistral", "prompt": payload.prompt}

    async def generator():
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", URL_OLLAMA_GENERATE, headers=HEADERS, json=data) as response:
                response.raise_for_status()
                async for chunk in response.aiter_bytes():
                    yield chunk.decode('utf-8')

    return StreamingResponse(generator(), media_type="application/json")

# ############################################################################### Chat

# @app.post("/chat")
# async def index(payload: PayloadChat):
#     async def generator():
#         async for chunk in await AsyncClient().chat(model='mistral', messages=payload.messages, options={"seed": 1}, stream=True):
#             yield json.dumps(chunk) + "\n"

#     return StreamingResponse(generator(), media_type="application/json")
@app.post("/chat")
async def index(payload: PayloadChat):
    data = {"model": "mistral", "messages": payload.messages, "options": payload.options}

    async def generator():
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", URL_OLLAMA_CHAT, headers=HEADERS, json=data) as response:
                response.raise_for_status()
                async for chunk in response.aiter_bytes():
                    yield chunk.decode('utf-8')

    return StreamingResponse(generator(), media_type="application/json")

# TODO: Make model load und unload (https://github.com/ollama/ollama/blob/main/docs/api.md#load-a-model, https://github.com/ollama/ollama/blob/main/docs/api.md#load-a-model-1)
# curl http://localhost:11434/api/generate -d '{
#   "model": "llama3.2"
# }'
# curl http://localhost:11434/api/generate -d '{
#   "model": "llama3.2",
#   "keep_alive": 0
# }'

# TODO: Make it respond only in JSON mode (https://github.com/ollama/ollama/blob/main/docs/api.md#request-json-mode)
# curl http://localhost:11434/api/generate -d '{
#   "model": "llama3.2",
#   "prompt": "What color is the sky at different times of the day? Respond using JSON",
#   "format": "json",
#   "stream": false
# }'

# Source: https://github.com/ollama/ollama/blob/main/docs/modelfile.md#valid-parameters-and-values
# TODO: Implement most useful parameters (https://github.com/ollama/ollama/blob/main/docs/api.md#generate-request-with-options)
# num_keep: Anzahl der letzten Vorhersagen, die behalten werden sollen. Nützlich, um Kontext für fortlaufende Konversationen zu speichern.
# seed: Setzt den Zufallswert für die Generierung, um reproduzierbare Ergebnisse zu erzielen.
# num_predict: Anzahl der Token, die generiert werden sollen.
# top_k: Begrenzung der Anzahl der wahrscheinlichsten nächsten Token, die bei der Vorhersage berücksichtigt werden (Top-K Sampling).
# top_p: Setzt den Schwellenwert für die kumulative Wahrscheinlichkeit, um die Auswahl der nächsten Token zu steuern (Nucleus Sampling).
# min_p: Minimalwert für die Wahrscheinlichkeit eines Tokens, um sicherzustellen, dass nur relevante Tokens in Betracht gezogen werden.
# tfs_z: Steuert die Temperatur bei Top-K Sampling für eine verbesserte Vielfalt.
# typical_p: Eine weitere Methode zur Steuerung der Vielfalt, ähnlich wie top_p, jedoch spezifisch für die typical sampling Strategie.
# repeat_last_n: Anzahl der letzten Token, die berücksichtigt werden, um Wiederholungen zu vermeiden.
# temperature: Beeinflusst die Kreativität der Antworten; höhere Werte (z.B. 1.0) führen zu vielfältigeren Ergebnissen, niedrigere Werte (z.B. 0.2) zu deterministischeren Ausgaben.
# repeat_penalty: Bestraft wiederholte Token in der Ausgabe, um die Vielfalt zu erhöhen.
# presence_penalty: Strafe für das Erscheinen bestimmter Tokens in der generierten Antwort, um Wiederholungen zu minimieren.
# frequency_penalty: Strafe für häufige Tokens in der Antwort, um die Vielfalt der Ausgaben zu fördern.
# mirostat: Aktiviert Mirostat Sampling, das dynamisch die Temperatur anpasst, um eine zielgerichtete Ausgabe zu gewährleisten.
# mirostat_tau: Parameter für Mirostat, der die Empfindlichkeit des Modells gegenüber Tokenverteilungen steuert.
# mirostat_eta: Ein weiterer Mirostat-Parameter zur Steuerung der Anpassungsgeschwindigkeit.
# penalize_newline: Bestimmt, ob neue Zeilen bestraft werden sollen, um formatierte Ausgaben zu steuern.
# stop: Eine Liste von Tokens, bei deren Auftreten die Generierung gestoppt wird.
# numa: Aktiviert die NUMA-Speicherverwaltung, um die Leistung zu optimieren.
# num_ctx: Maximale Anzahl der Kontext-Tokens, die für die Vorhersage verwendet werden.
# num_batch: Anzahl der Batch-Anfragen zur Parallelverarbeitung von Vorhersagen.
# num_gpu: Anzahl der GPUs, die für die Berechnungen verwendet werden.
# main_gpu: Bestimmt die Haupt-GPU für die Verarbeitung.
# low_vram: Optimiert den Speicherverbrauch für Systeme mit wenig VRAM.
# f16_kv: Verwendet 16-Bit-Gleitkommazahlen zur Optimierung des Speicherverbrauchs bei Schlüsseln und Werten.
# vocab_only: Wenn true, wird nur das Vokabular und keine Gewichte geladen.
# use_mmap: Erlaubt die Verwendung von Memory Mapping für effizientes Laden von Modellen.
# use_mlock: Steuert die Verwendung von mlock, um zu verhindern, dass Speicher auf die Festplatte ausgelagert wird.
# num_thread: Anzahl der Threads, die zur Verarbeitung von Anfragen verwendet werden.