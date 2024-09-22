# %%
import re
import torch
import torch.nn.functional as F
from lib.utils import load, preprocess, get_dict, ask_dict

# %%
NGRAM_LENGTH_MIN = 1 # uni-gram
NGRAM_CONTEXT_WINDOW = 2

END_TOKEN = "</s>"
WITH_END_TOKEN = True

# %% [markdown]
# ## Preprocessing

# %%
list_str = load('./data/songs.json')
list_str = [preprocess(str["row"]["text"]) for str in list_str["rows"] if str["row"]["text"]]

if WITH_END_TOKEN:
    # Treat new lines as a word or not
    list_str = [str.replace("\n", f" {END_TOKEN} ") for str in list_str]

list_str

# %% [markdown]
# ## Intializations

# %%
# Split the lines into words and lowercase them
list_list_words = [re.split(r'[\s\n]+', str.lower().strip()) for str in list_str]
list_str_comp = ["+".join(list_words) for list_words in list_list_words]

print(list_list_words[0])

# %%
lengths = [len(list_words) for list_words in list_list_words]
lengths_sorted = sorted(lengths)

# The biggest n-gram can only be the length of the smallest song
NGRAM_LENGTH_MAX = lengths_sorted[0]

print(min(lengths), max(lengths))
print(NGRAM_LENGTH_MIN, NGRAM_LENGTH_MAX)

# %% [markdown]
# ## Dictionary

# %%
dict_key_tuple = get_dict(list_list_words, NGRAM_CONTEXT_WINDOW)
arr_key_tuple_answers = ask_dict(dict_key_tuple, "i")

arr_key_tuple_answers

dicts = {}

# %%
def predict(list_list_words: list, input: str, seed = None, max_lines = 10, separator = "+"):
    if len(input) == 0:
        return "Input cannot be empty"
    list_inputs = input.split(separator)
    ngram_context_window = len(list_inputs) + 1
    
    # Provided that the input is sanitized already
    arg = input
    max_index = 0
    generator = torch.Generator().manual_seed(seed) if seed else None

    # Generate the dictionary
    dict_key_tuple = dicts.get(ngram_context_window) or get_dict(list_list_words, ngram_context_window)
    if ngram_context_window not in dicts:
        dicts[ngram_context_window] = dict_key_tuple

    # Print over all list_words as a starter
    print("START\n")
    for _input in list_inputs:
        print(_input, end=" ")

    while True:
        # Get normalized probabilities for that input
        arr_key_tuple_answers = ask_dict(dict_key_tuple, arg)
        if len(arr_key_tuple_answers) == 0: return None

        # Extract probability tensor
        tensor_probs = torch.tensor([rel for (_, _, _, rel) in arr_key_tuple_answers], dtype=torch.float32)

        # Sample through the tensor
        dict_multinomial = {
            "input": tensor_probs,
            "num_samples": 1,
            "replacement": True
        }
        if generator:
            dict_multinomial["generator"] = generator
        i = torch.multinomial(**dict_multinomial).item()

        # Get the key using the sampled index
        key = arr_key_tuple_answers[i][0]

        # Split the key at the separator ("+")
        list_keys = key.split(separator)

        # Iterate list_keys as long as there is no end token (</s>)
        for _key in list_keys[len(list_keys) - 1:]:
            if _key == END_TOKEN:
                max_index += 1
                print("")
            else:
                print(_key, end=" ")

        # arg is the key replaced by the former arg and the separator
        arg = "+".join(list_keys[1:])
        if (max_index >= max_lines):
            print("\nEND")
            break

predict(list_list_words, "the+club+isnt")

# Possible questions:
# - Can you generate the same output with both wihtout and with the seed?
# - How to generate accurate song lyrics from Shape of You by Ed Sheeran?
# - Why does your generation stop abruptly?

# %%



