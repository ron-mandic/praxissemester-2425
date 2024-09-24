import re
from copy import deepcopy
import torch
import torch.nn.functional as F
from lib.utils import load, preprocess, get_dict, ask_dict
from lib.constants import END_TOKEN, WITH_END_TOKEN

def load_data(path: str):
    data_with_duplicates = load(path)
    data = deepcopy(data_with_duplicates)

    data_with_duplicates["duplicates"] = [49, 50, 70, 76]   # Keep track of duplicates if needed

    del data["rows"][49] # Shape of You
    del data["rows"][50 - 1] # You Need Me, I Don't Need You
    del data["rows"][70 - 2] # Dive
    del data["rows"][76 - 3] # Take Me Back to London

    list_str = [preprocess(str["row"]["text"]) for str in data["rows"] if str["row"]["text"]]
    list_str_with_token = [str.replace("\n", f" {END_TOKEN} ") for str in list_str]
    return data_with_duplicates, data, list_str, list_str_with_token