PATH = "./data/songs.json"

END_TOKEN = "[end]"
WITH_END_TOKEN = False

"""Maximum number of tokens the client can request"""
MAX_CONTEXT_LENGTH = 5

API_URL_FILL_MASK = "https://api-inference.huggingface.co/models/google-bert/bert-base-cased"
API_URL_QUESTION_ANSWERING = "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2"
API_URL_TEXT_CLASSIFICATION_SENTIMENT = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
API_URL_TEXT_CLASSIFICATION_EMOTIONS = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base"
API_URL_TEXT_GENERATION = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B"
API_URL_SUMMARIZATION = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
API_URL_TRANSLATION = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-de"
API_URL_TEXT2TEXT = "https://api-inference.huggingface.co/models/google/flan-t5-base"
API_URL_SENTENCE_SIMILARITY = "https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-MiniLM-L6-v2"
API_URL_ZERO_SHOT_CLASSIFICATION = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"