from typing import Optional
from pydantic import BaseModel, Field
import torch
from lib.utils import ask_dict, get_dict, sample, get_samples

class Unigram():
    MAX_NGRAM_LENGTH = 1

    def __init__(self, list_list_words):
        self.dict = get_dict(list_list_words, self.MAX_NGRAM_LENGTH)
        self.list = [(key, tuple[0], tuple[1]) for key, tuple in self.dict.items()]
        self.tensor = torch.tensor([tuple[1] for _, tuple in self.dict.items()], dtype=torch.float32)

    def predict(self):
        return sample(self.tensor, self.list)
    
    def get_predictions(self, num_samples = 10):
        return get_samples(self.tensor, self.list, num_samples)
    
class Bigram():
    MAX_NGRAM_LENGTH = 2

    def __init__(self, list_list_words):
        self.dict = get_dict(list_list_words, self.MAX_NGRAM_LENGTH)

    def predict(self, context: str):
        list_key_tuple_answers = ask_dict(self.dict, context)
        if len(list_key_tuple_answers) == 0: return None

        tensor = torch.tensor([rel for (_, _, _, rel) in list_key_tuple_answers], dtype=torch.float32)
        return sample(tensor, list_key_tuple_answers)
    
    def get_predictions(self, context: str, num_samples = 10):
        list_key_tuple_answers = ask_dict(self.dict, context)
        if len(list_key_tuple_answers) == 0: return None

        tensor = torch.tensor([rel for (_, _, _, rel) in list_key_tuple_answers], dtype=torch.float32)
        return get_samples(tensor, list_key_tuple_answers, num_samples)
    
    def get_all_predictions(self, context: str):
        list_key_tuple_answers = ask_dict(self.dict, context)
        if len(list_key_tuple_answers) == 0: return None

        return sorted(list_key_tuple_answers, key=lambda x: x[1], reverse=True)
    
class Ngram():
    def __init__(self, list_list_words, max_context_length):
        self.dict = {}
        self.generators = {}
        for i in range(0, max_context_length):
            self.dict[i] = get_dict(list_list_words, i + 1)
    
    def register_generator(self, seed):
        if seed not in self.generators:
            generator = torch.Generator().manual_seed(seed)
            self.generators[seed] = generator
        else:
            print(f"Ngram.register_generator: Seed {seed} already registered")
    
    def predict(self, context: str, context_length: int, seed: Optional[int] = None):
        list_key_tuple_answers = ask_dict(self.dict[context_length], context)
        if len(list_key_tuple_answers) == 0:
            return None

        tensor = torch.tensor([rel for (_, _, _, rel) in list_key_tuple_answers], dtype=torch.float32)

        # Dynamically pack and unpack arguments
        args = {
            "input": tensor,
            "num_samples": 1,
            "replacement": True
        }
        if seed is not None:
            args["generator"] = torch.Generator().manual_seed(seed)
        
        index = torch.multinomial(**args).item()
        return list_key_tuple_answers[index]
    
    def get_predictions(self, context: str, context_length: int, num_samples = 10, seed: Optional[int] = None):
        list_key_tuple_answers = ask_dict(self.dict[context_length], context)
        if len(list_key_tuple_answers) == 0:
            return None

        tensor = torch.tensor([rel for (_, _, _, rel) in list_key_tuple_answers], dtype=torch.float32)
        return get_samples(tensor, list_key_tuple_answers, num_samples, seed)
    
    def get_all_predictions(self, context: str, context_length: int):
        list_key_tuple_answers = ask_dict(self.dict[context_length], context)
        if len(list_key_tuple_answers) == 0:
            return None

        return sorted(list_key_tuple_answers, key=lambda x: x[1], reverse=True)
    
class QC(BaseModel):
    question: str
    context: str

class SSS(BaseModel):
    source_sentence: str
    sentences: list[str]

class C(BaseModel):
    candidate_labels: list[str]

class PayloadInput(BaseModel):
    inputs: str

class PayloadInputQC(BaseModel):
    inputs: QC

class PayloadInputSSS(BaseModel):
    inputs: SSS

class PayloadInputP(BaseModel):
    inputs: str
    parameters: C

class PayloadInputT(BaseModel):
    inputs: str
    treebank: bool

class PayloadInputI(BaseModel):
    inputs: str
    iterations: int