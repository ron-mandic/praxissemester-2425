from enum import Enum
from fastapi import FastAPI, HTTPException, Path, Query, Depends, status as Status
from pydantic import BaseModel, Field
from typing import Optional

from predictor import load_data
from lib.utils import sanitize
from lib.constants import PATH, END_TOKEN
from lib.classes import Unigram, Bigram

app = FastAPI()

data_with_duplicates, data, list_str, list_str_with_token = load_data(PATH)

list_list_words = sanitize(list_str)
list_list_words_with_token = sanitize(list_str_with_token)

model_unigram = Unigram(list_list_words_with_token)
model_bigram = Bigram(list_list_words_with_token)
# model_ngram = Ngram()

@app.get("/")
def index(with_duplicates: Optional[int] = 1):
    if bool(with_duplicates):
        return data_with_duplicates
    return data

@app.get("/unigram")
def index(num_samples: Optional[int] = 1):
    if num_samples is None:
        return {"data": model_unigram.predict()}

    return {"data": model_unigram.get_predictions(num_samples)}

@app.get("/bigram")
def index(context: str, num_samples: Optional[int] = 1):
    if context is None:
        raise HTTPException(status_code=Status.HTTP_400_BAD_REQUEST, detail="/bigram: Context is required")
    if num_samples is None:
        return {"data": model_bigram.predict(context)}
    elif num_samples == -1:
        return {"data": model_bigram.get_all_predictions(context)}

    return {"data": model_bigram.get_predictions(context, num_samples)}