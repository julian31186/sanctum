from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()
client = OpenAI()
dictionary="../dictionary.json"
embed_output="../embeds.json"

def get_embedding(text, model="text-embedding-3-small"):
   text = text.replace("\n", " ")
   return client.embeddings.create(input = [text], model=model).data[0].embedding

def load_embed():
    vectors = []
    with open(dictionary,"r") as f:
        d = json.load(f)
        for word,definition in d.items():
            vectors.append({ "id" : word, "values" : get_embedding(definition) })
        
    with open(embed_output, 'w') as f:
        json.dump(vectors, f,indent=4)

load_embed()