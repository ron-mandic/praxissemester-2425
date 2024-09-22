import json, re

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

def sample(tensor_probs, list_key_tuple):
    index = torch.multinomial(tensor_probs, num_samples=1, replacement=True).item()
    return list_key_tuple[index][0]

def get_samples(tensor_probs, list_key_tuple, num_samples):
    indexes = torch.multinomial(tensor_probs, num_samples=num_samples, replacement=True)
    return [list_key_tuple[index.item()] for index in indexes]

def sample_with_generator(tensor_probs, list_key_tuple, generator):
    index = torch.multinomial(tensor_probs, num_samples=1, replacement=True, generator=generator).item()
    return list_key_tuple[index][0]