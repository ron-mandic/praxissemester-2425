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
    
    def registerGenerator(self, seed):
        if seed not in self.generators:
            generator = torch.Generator().manual_seed(seed)
            self.generators[seed] = generator
        else:
            print(f"Ngram.registerGenerator: Seed {seed} already registered")
    
    def predict(self, context: str, ngram_length: int):
        list_key_tuple_answers = ask_dict(self.dict[ngram_length], context)
        if len(list_key_tuple_answers) == 0:
            return None

        tensor = torch.tensor([rel for (_, _, _, rel) in list_key_tuple_answers], dtype=torch.float32)
        index = torch.multinomial(tensor, num_samples=1, replacement=True).item()
        return list_key_tuple_answers[index]
    
    def get_predictions(self, context: str, ngram_length, num_samples = 10):
        list_key_tuple_answers = ask_dict(self.dict[ngram_length], context)
        if len(list_key_tuple_answers) == 0:
            return None

        tensor = torch.tensor([rel for (_, _, _, rel) in list_key_tuple_answers], dtype=torch.float32)
        return get_samples(tensor, list_key_tuple_answers, num_samples)
    
    def get_all_predictions(self, context: str, ngram_length):
        list_key_tuple_answers = ask_dict(self.dict[ngram_length], context)
        if len(list_key_tuple_answers) == 0:
            return None

        return sorted(list_key_tuple_answers, key=lambda x: x[1], reverse=True)