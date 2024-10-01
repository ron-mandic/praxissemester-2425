from typing import Optional
from collections import defaultdict
import json, re, requests
import torch

def load(path: str, encoding = 'utf-8') -> dict:
    with open(path, 'r', encoding=encoding) as f:
        return json.load(f)
    
def preprocess(str: str) -> str:
    # Remove the first part with the title 
    reg0 = re.compile(r'^.* Lyrics\n')
    str0 = reg0.sub('', str)
    # Remove the end part
    reg1 = re.compile(r'\d+Embed$')
    str1 = reg1.sub('', str0)
    # Sanitize str0 by removing all ",", "'", ".", "-", ...
    regEnd0 = re.compile(r'[\,\'\’\.\!\?\:\;\(\)\[\]\{\}…¨]+')
    strEnd0 = regEnd0.sub('', str1)
    regEnd1 = re.compile(r'[\-\—]+')
    strEnd1 = regEnd1.sub(' ', strEnd0)
    return strEnd1

def sanitize(list_str):
    return [re.split(r'[\s\n]+', str.lower().strip()) for str in list_str]

def split_into_ngrams(list_words, n) -> list:
    return [list_words[i:i+n] for i in range(len(list_words)-n+1)]

def get_dict (list_list_words: list, size = 1, reverse = True) -> list:
    dict = {}

    for list_words in list_list_words:
        ngrams = split_into_ngrams(list_words, size)

        for ngram in ngrams:
            key = "+".join(ngram)
            if key in dict:
                dict[key] += 1
            else:
                dict[key] = 1

    arr_tuple = sorted(dict.items(), key=lambda x: x[1], reverse=reverse)
    total = sum(value for (_, value) in arr_tuple)
    # Absolute and relative values (normalized)
    arr_tuple = [(key, value, value/total) for (key, value) in arr_tuple]
    # sum(rel for (_, _, rel) in dict_tuple) == 1.0

    return {key: (abs, rel) for (key, abs, rel) in arr_tuple}

def ask_dict(dict_key_tuple: dict, str: str, separator = "+") -> list:
    dict = {key: tuple for key, tuple in dict_key_tuple.items() if key.startswith(str+separator)} 
    total = sum([tuple[0] for tuple in dict.values()])
    
    return [(key, tuple[0], tuple[1], tuple[0]/total) for key, tuple in dict.items()]

# classes

def sample(tensor_probs, list_key_tuple):
    index = torch.multinomial(tensor_probs, num_samples=1, replacement=True).item()
    return list_key_tuple[index][0]

def get_samples(tensor_probs, list_key_tuple, num_samples: int, seed: Optional[int] = None):
    """Seed is optional such that this function can also be used by Unigram and Bigram"""

    # Dynamically pack and unpack arguments
    args = {
        "input": tensor_probs,
        "num_samples": num_samples,
        "replacement": True
    }
    if seed is not None:
        args["generator"] = torch.Generator().manual_seed(seed)

    indexes = torch.multinomial(**args)
    return [list_key_tuple[index.item()] for index in indexes]

# Helpers

def query(payload, api_url, headers):
    response = requests.post(api_url, headers=headers, json=payload.dict())
    return response.json()

def to_fragments(data):
    fragments = []
    word = data["word"]
    stem = data["stem"]
    suffix = word[len(stem):] 

    if word == stem:
        suffix = ""
    fragments.append(stem)
    if suffix:
        fragments.append(suffix)

    return fragments

def split_affixes(sentence, tokenizer, stemmer):
    words = tokenizer.tokenize(sentence)
    
    tokens = []
    for word in words:
        w = word.lower()
        stem = stemmer.stem(w)

        dict = {"word": w, "stem": stem}
        list_fragments = to_fragments(dict)

        for fragment in list_fragments:
            tokens.append(fragment)
    
    return tokens

# External sources
# Source: https://www.geeksforgeeks.org/byte-pair-encoding-bpe-in-nlp/
def get_stats(vocab):
    """
    Given a vocabulary (dictionary mapping words to frequency counts), returns a 
    dictionary of tuples representing the frequency count of pairs of characters 
    in the vocabulary.
    """
    pairs = defaultdict(int)
    for word, freq in vocab.items():
        symbols = word.split()
        for i in range(len(symbols)-1):
            pairs[symbols[i],symbols[i+1]] += freq
    return pairs

def merge_vocab(pair, v_in):
    """
    Given a pair of characters and a vocabulary, returns a new vocabulary with the 
    pair of characters merged together wherever they appear.
    """
    v_out = {}
    bigram = re.escape(' '.join(pair))
    p = re.compile(r'(?<!\S)' + bigram + r'(?!\S)')
    for word in v_in:
        w_out = p.sub(''.join(pair), word)
        v_out[w_out] = v_in[word]
    return v_out

def get_vocab(data, end_token):
    """
    Given a list of strings, returns a dictionary of words mapping to their frequency 
    count in the data.
    """
    vocab = defaultdict(int)
    for line in data:
        for word in line.split():
            vocab[' '.join(list(word)) + f' {end_token}'] += 1
    return vocab

def bpe(data, n, end_token = "</w>"):
    """
    Given a list of strings and an integer n, returns a list of n merged pairs
    of characters found in the vocabulary of the input data.
    """
    vocab = get_vocab(data, end_token)

    for _ in range(n):
        pairs = get_stats(vocab)
        best = max(pairs, key=pairs.get)
        vocab = merge_vocab(best, vocab)

    return vocab