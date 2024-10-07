from enum import Enum
from fastapi import FastAPI, HTTPException, Path, Query, Depends, status as Status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from dotenv import load_dotenv
from nltk.tokenize import WhitespaceTokenizer, WordPunctTokenizer, TreebankWordTokenizer
from nltk.stem import PorterStemmer, WordNetLemmatizer
from predictor import load_data
from lib.utils import aquery, bpe, get_stats, query, sanitize, word_analysis
from lib.constants import API_URL_FILL_MASK, API_URL_QUESTION_ANSWERING, API_URL_SENTENCE_SIMILARITY, API_URL_SUMMARIZATION, API_URL_TEXT2TEXT, API_URL_TEXT_CLASSIFICATION_EMOTIONS, API_URL_TEXT_CLASSIFICATION_SENTIMENT, API_URL_TEXT_GENERATION, API_URL_TRANSLATION, API_URL_ZERO_SHOT_CLASSIFICATION, PATH, END_TOKEN, MAX_CONTEXT_LENGTH
from lib.classes import PayloadInput, PayloadInputP, PayloadInputT, PayloadInputI, PayloadInputQC, PayloadInputSSS, Unigram, Bigram, Ngram
import nltk
import os, re
import spacy

# Own model
data_with_duplicates, data, list_str, list_str_with_token = load_data(PATH)
list_list_words = sanitize(list_str)
list_list_words_with_token = sanitize(list_str_with_token)
model_unigram = Unigram(list_list_words_with_token)
model_bigram = Bigram(list_list_words_with_token)
model_ngram = Ngram(list_list_words_with_token, max_context_length=MAX_CONTEXT_LENGTH)

# Hugging Face
load_dotenv(dotenv_path=".env")
HF_TOKEN = os.getenv("HF_TOKEN")
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

# nltk
nltk.download('punkt')
nltk.download('wordnet')
whitespace_tokenizer = WhitespaceTokenizer()
wordpunct_tokenizer = WordPunctTokenizer()
treebank_tokenizer = TreebankWordTokenizer()
stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()

# spacy
nlp = spacy.load("en_core_web_sm")

app = FastAPI()

"""
###############################################
############################################### Own model
###############################################
"""
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

@app.get("/ngram")
def index(context: str, context_length: int, num_samples: Optional[int] = 1, seed: Optional[int] = None):
    # seed Hint: Could resolve in massive memory usage with almost 10.000 possible instances
    # if seed is not None:
    #     model_ngram.register_generator(seed)
    
    # context
    if context is None:
        raise HTTPException(status_code=Status.HTTP_400_BAD_REQUEST, detail="/ngram: Context is required")

    # ngram_length
    if context_length is None:
        raise HTTPException(status_code=Status.HTTP_400_BAD_REQUEST, detail="/ngram: Context length is required")
    if context_length < 0:
        raise HTTPException(status_code=Status.HTTP_400_BAD_REQUEST, detail="/ngram: Context length must be greater than 0")
    if context_length > MAX_CONTEXT_LENGTH:
        raise HTTPException(status_code=Status.HTTP_400_BAD_REQUEST, detail="/ngram: Context length must be less than or equal to 4")

    # num_samples
    if num_samples is None or num_samples == 1:
        return {"data": model_ngram.predict(context, context_length, seed)}
    elif num_samples == -1:
        return {"data": model_ngram.get_all_predictions(context, context_length)} 

    return {"data": model_ngram.get_predictions(context, context_length, num_samples, seed)}

"""
###############################################
############################################### Hugging Face
###############################################
"""
@app.post("/fill-mask")
async def index(payload: PayloadInput):
    output = await aquery(payload, API_URL_FILL_MASK, headers)
    return output

@app.post("/question-answering")
async def index(payload: PayloadInputQC):
    output = await aquery(payload, API_URL_QUESTION_ANSWERING, headers)
    return output

@app.post("/text-classification/sentiment")
async def index(payload: PayloadInput):
    output = await aquery(payload, API_URL_TEXT_CLASSIFICATION_SENTIMENT, headers)
    return output

@app.post("/text-classification/emotions")
async def index(payload: PayloadInput):
    output = await aquery(payload, API_URL_TEXT_CLASSIFICATION_EMOTIONS, headers)
    return output

@app.post("/text-generation")
async def index(payload: PayloadInput):
    output = await aquery(payload, API_URL_TEXT_GENERATION, headers)
    return output

@app.post("/summarization")
async def index(payload: PayloadInput):
    output = await aquery(payload, API_URL_SUMMARIZATION, headers)
    return output

@app.post("/translation")
async def index(payload: PayloadInput):
    """en to de"""
    output = await aquery(payload, API_URL_TRANSLATION, headers)
    return output

@app.post("/text2text")
async def index(payload: PayloadInput):
    """reasoning"""
    output = await aquery(payload, API_URL_TEXT2TEXT, headers)
    return output

@app.post("/sentence-similarity")
async def index(payload: PayloadInputSSS):
    output = await aquery(payload, API_URL_SENTENCE_SIMILARITY, headers)
    return output

@app.post("/zero-shot-classification")
async def index(payload: PayloadInputP):
    output = await aquery(payload, API_URL_ZERO_SHOT_CLASSIFICATION, headers)
    return output

"""
###############################################
############################################### Tokenizer
###############################################
"""
# Source: https://youtu.be/nxhCyeRR75Q?si=MvKF43suJ9NX8iZ-
@app.post("/tokenizer/whitespace")
async def index(payload: PayloadInput):
    """Problem: it and it? are different tokens with the same meaning"""
    tokens = whitespace_tokenizer.tokenize(payload.inputs)
    return tokens

@app.post("/tokenizer/punctuation")
async def index(payload: PayloadInputT):
    """Advantage: Split both by words and punctuation"""
    """Problem: s, isn or t are not very meaningful either"""
    if payload.treebank:
        # With grammar rules of English language
        tokens = treebank_tokenizer.tokenize(payload.inputs)
    else:
        tokens = wordpunct_tokenizer.tokenize(payload.inputs)   
    return tokens

@app.post("/tokenizer/affixes")
async def index(payload: PayloadInput):
    """Problem: unnatural endings e.g. thi and s due to in-built heuristics"""
    words = treebank_tokenizer.tokenize(payload.inputs)
    return word_analysis(words, stemmer, lemmatizer, nlp)

# Route für BPE-Tokenization
@app.post("/tokenizer/bpe")
def index(input: PayloadInputI):
    """Problem: Optimize for iteration cycles or vocabulary size?"""
    data = input.inputs.split(".")
    iterations = input.iterations
    
    try:
        tokens, rules = bpe(data, iterations)
        # Case to original dict since lists /tuples) are not hasable / cannot be used for keys
        stats = {f"{tuple[0]} {tuple[1]}": iterations for (tuple, iterations) in get_stats(tokens).items()}

        # Guard clause
        expressions = tokens.keys()
        no_more_whitespace = all(re.match(r"^\S+$", expression) for expression in expressions)
        empty_stats = not stats

        if no_more_whitespace and empty_stats:
            return {
                "info": "No more whitespace in tokens",
                "tokens": [{"token": key, "count": value} for (key, value) in tokens.items()],
                "iterations": iterations,
                "rules": rules,
                "stats": []
            }

        stats = dict(sorted(stats.items(), key=lambda item: (-item[1], item[0])))
        return {
            "tokens": [{"token": key, "count": value} for (key, value) in tokens.items()],
            "iterations": iterations,
            "rules": rules,
            "stats": [{"token": key, "count": value} for (key, value) in stats.items()]
        }
    except Exception as e:
        return {
            "error": "BPE cannot be applied anymore due to lack of whitespace",
        }