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

OLLAMA_MODEL = "mistral:latest"
URL_OLLAMA_GENERATE = "http://localhost:11434/api/generate"
URL_OLLAMA_EMBED = "http://localhost:11434/api/embed"
URL_OLLAMA_EMBEDDINGS = URL_OLLAMA_EMBED + "dings"
URL_OLLAMA_CHAT = "http://localhost:11434/api/chat"
HEADERS = {
    'Content-Type': 'application/json',
}

models = {
    # TODO: Add more models
    "gpt2": {
        "tokenizer": AutoTokenizer.from_pretrained("openai-community/gpt2"),
        "model": AutoModelForCausalLM.from_pretrained("openai-community/gpt2"),
        "model_name": "openai-community/gpt2"
    },
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
    content_system: str = None

class PayloadParamsLogits(BaseModel):
    model: Literal["gpt2"] = "gpt2"
    prompt: str
    temperature: Optional[float] = 0.7
    seed: Optional[int] = None
    num_samples: Optional[int] = 7

# ############################################################################### Seed and Temperature
@app.post("/gpt2")
async def index(payload: PayloadParamsLogits):
    """Source: https://huggingface.co/docs/transformers/main/en/model_doc/gpt2#transformers.GPT2LMHeadModel.forward.example"""
    m = models[payload.model]
    model: AutoModelForCausalLM = m["model"]
    tokenizer: AutoTokenizer = m["tokenizer"]
    model_name: str = m["model_name"]

    prompt = payload.prompt
    temperature = min(max(payload.temperature, 1e-6), 2.0)
    seed = payload.seed
    k = payload.num_samples

    # Tokenization
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model(**inputs, labels=inputs["input_ids"])
    logits = outputs.logits[-1, -1, :] # (batch-size, sequence-length, vocab-size) -> (vocab)

    # Scaling logits by temperature
    scaled_logits = logits / temperature
    probabilities = F.softmax(scaled_logits, dim=-1)

    # TODO: Implement custom generation mechanism ("Connection was forcibly closed by a peer" GPU needed)
    # print(list(outputs.past_key_values)[0][0].shape) # torch.Size([1, 12, 4, 64]) (Batch-size, number of attention-heads, sequence-length, hidden-size)
    # past_key_values = outputs.past_key_values

    # # Generiere mehrere Tokens
    # for _ in range(5):
    #     # Berechne die Wahrscheinlichkeiten aus den Logits
    #     logits = outputs.logits[-1, -1, :]  # Letzte Logits
    #     probabilities = F.softmax(logits, dim=-1)  # Softmax für Wahrscheinlichkeiten

    #     # Sample next_token
    #     next_token = torch.multinomial(probabilities, num_samples=1)  # Ziehe ein Token

    #     # Dekodiere das Token
    #     decoded_token = tokenizer.decode(next_token, skip_special_tokens=True)  # Dekodierung ohne spezielle Tokens
    #     print(decoded_token, end=" ")

    #     # Bereite die neuen Eingaben für das Modell vor
    #     new_inputs = tokenizer.encode(decoded_token, return_tensors="pt")  # Encoding als Tensor
    #     # new_inputs = new_inputs.to(outputs.logits.device)  # Sicherstellen, dass die Eingaben auf dem richtigen Gerät sind

    #     # Führe das Modell mit den neuen Eingaben und den past_key_values aus
    #     outputs = model(new_inputs, past_key_values=past_key_values, use_cache=True)
    #     past_key_values = outputs.past_key_values
    
    # Top and bottom k probabilities
    top_probabilities, top_indices = torch.topk(input=probabilities, k=k)
    bottom_probabilities, bottom_indices = torch.topk(input=probabilities, k=k, largest=False)
    
    # Decoding the samples
    decoded_top_samples = [tokenizer.decode([idx], clean_up_tokenization_spaces = False) for idx in top_indices]
    decoded_bottom_samples = [tokenizer.decode([idx], clean_up_tokenization_spaces = False) for idx in bottom_indices]

    # Random sample for less deterministic results
    if seed is not None:
        random_index = torch.multinomial(top_probabilities, num_samples=1, replacement=True, generator=torch.Generator().manual_seed(seed)).item()
    else:
        random_index = torch.multinomial(top_probabilities, num_samples=1, replacement=True).item()
    
    vocab = tokenizer.get_vocab()
    prompt_tokens = [{"token": tokenizer.decode([idx], clean_up_tokenization_spaces=False), "token_id": None} for idx in inputs["input_ids"].squeeze()]
    for prompt_token in prompt_tokens:
        if prompt_token["token"] in vocab:
            prompt_token["token_id"] = vocab[prompt_token["token"]]

    # vocab_output = [
    #     {
    #         "token": token,
    #         "logit": scaled_logit.item(),
    #         "probability": prob.item()
    #     }
    #     for token, scaled_logit, prob in zip(
    #         [tokenizer.decode([idx], clean_up_tokenization_spaces=False) for idx in range(len(probabilities))],
    #         scaled_logits,
    #         probabilities
    #     )
    # ]

    top_k_results = [ {"token": decoded_top_samples[i], "logit": logits[top_indices[i]].item(), "probability": top_probabilities[i].item()} for i in range(k) ]
    bottom_k_results = sorted([ {"token": decoded_bottom_samples[i], "logit": logits[bottom_indices[i]].item(), "probability": bottom_probabilities[i].item()} for i in range(k) ], key=lambda x: -x["probability"])

    # TODO: Make visualizations for the top_k_sample and bottom_k_sample (how to choose them from the analogous urn)
    response = {
        "model": model_name,
        "stats": {
            "temperature": temperature,
            "seed": seed,
            "num_samples": k,
            "loss": outputs.loss.item(),
            "prompt_tokens": prompt_tokens,
            "prompt_length": len(tokenizer(prompt)["input_ids"]),
            "attention_mask": inputs["attention_mask"].tolist(),
            # "vocab": vocab,
            # "vocab_output": sorted(vocab, key=lambda x: x["probability"], reverse=True),
            "vocab_size": len(tokenizer.get_vocab()),
            "entropy": -torch.sum(probabilities * torch.log(probabilities + 1e-10)).item(),
            "avg_top_probability": top_probabilities.mean().item(),
            "avg_bottom_probability": bottom_probabilities.mean().item(),
        },
        "top_k": top_k_results,
        "bottom_k": bottom_k_results,
        "top_k_sample": top_k_results[random_index],
        "bottom_k_sample": bottom_k_results[random_index],
    }

    return response

# ############################################################################### Embeddings
# @app.post("/embed")
# async def index(payload: PayloadInput):
#     return ollama.embed(model='mistral', input=payload.input)
@app.post("/embed")
async def index(payload: PayloadInput):
    """It is assumed that the model is only Mistral, so no need to both specify model and input for now"""
    data = {"model": OLLAMA_MODEL, "input": payload.input}
    async with httpx.AsyncClient() as client:
        response = await client.post(URL_OLLAMA_EMBED, headers=HEADERS, json=data)
        return response.json()
    
# ############################################################################### Visualize
# TODO: Implement euclidian distance / cosinus similarity in the frontend
@app.post("/tsne")
async def index(payload: PayloadInputTSNE):
    """It is assumed that the model is only Mistral, so no need to both specify model and input for now"""
    data = {"model": OLLAMA_MODEL, "input": payload.input}
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
    data = {"model": OLLAMA_MODEL, "prompt": payload.prompt}

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

# ############################################################################### Miscellaneous
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