import re
import torch
import torch.nn.functional as F
from lib.utils import load, preprocess, get_dict, ask_dict
from lib.constants import END_TOKEN, WITH_END_TOKEN

def load_data(path: str):
    data = load(path)
    list_str = [preprocess(str["row"]["text"]) for str in data["rows"] if str["row"]["text"]]
    list_str_with_token = [str.replace("\n", f" {END_TOKEN} ") for str in list_str]
    return list_str, list_str_with_token