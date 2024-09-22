import torch
from lib.utils import get_dict, sample, get_samples, sample_with_generator

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