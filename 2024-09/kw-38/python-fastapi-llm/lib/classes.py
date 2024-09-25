import torch
from lib.utils import ask_dict, get_dict, sample, get_samples

class Unigram():
    NGRAM_CONTEXT_WINDOW = 1

    def __init__(self, list_list_words):
        self.dict = get_dict(list_list_words, self.NGRAM_CONTEXT_WINDOW)
        self.list = [(key, tuple[0], tuple[1]) for key, tuple in self.dict.items()]
        self.tensor = torch.tensor([tuple[1] for _, tuple in self.dict.items()], dtype=torch.float32)

    def predict(self):
        return sample(self.tensor, self.list)
    
    def get_predictions(self, num_samples = 10):
        return get_samples(self.tensor, self.list, num_samples)
    
class Bigram():
    NGRAM_CONTEXT_WINDOW = 2

    def __init__(self, list_list_words):
        self.dict = get_dict(list_list_words, self.NGRAM_CONTEXT_WINDOW)

    def predict(self, context: str):
        if context is None: return None
        list_key_tuple_answers = ask_dict(self.dict, context)
        if len(list_key_tuple_answers) == 0: return None

        tensor = torch.tensor([rel for (_, _, _, rel) in list_key_tuple_answers], dtype=torch.float32)
        return sample(tensor, list_key_tuple_answers)
    
    def get_predictions(self, context: str, num_samples = 10):
        if context is None: return None
        list_key_tuple_answers = ask_dict(self.dict, context)
        if len(list_key_tuple_answers) == 0: return None

        tensor = torch.tensor([rel for (_, _, _, rel) in list_key_tuple_answers], dtype=torch.float32)
        return get_samples(tensor, list_key_tuple_answers, num_samples)
    
    def get_all_predictions(self, context: str):
        if context is None: return None
        list_key_tuple_answers = ask_dict(self.dict, context)
        if len(list_key_tuple_answers) == 0: return None

        return sorted(list_key_tuple_answers, key=lambda x: x[1], reverse=True)