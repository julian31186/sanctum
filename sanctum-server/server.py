from flask import Flask,request, abort, make_response, jsonify
from scipy import spatial
from flask_cors import CORS
from dotenv import load_dotenv

from pinecone.grpc import PineconeGRPC as Pinecone
from openai import OpenAI

import json
import os

app = Flask(__name__)
CORS(app)
load_dotenv()
client = OpenAI()
embed_count = 0
words = None
with open('../dictionary.json', "r") as f:
    words = json.load(f)

pc = Pinecone(api_key=os.getenv("PINECONE_DB"))
index = pc.Index("sanctum")

def get_embedding(text, model="text-embedding-3-small"):
   global embed_count
   text = text.replace("\n", " ")
   embed_count += 1
   print("Loading Embed...")
   print(f'Embed count this instance -> {embed_count}')
   return client.embeddings.create(input = [text], model=model).data[0].embedding

def fetch_pc_embed(word):
    res = index.fetch(ids=[word])
    return res['vectors'][word]['values']

def get_cosine_sim(v1, v2):
    return 1 - spatial.distance.cosine(v1, v2)

@app.route("/query", methods=['POST'])
def query():
    definition = request.args.get('definition')
    original_word = request.args.get("word")

    if not definition: abort(500, "Server Error: Definition not provided")
    
    definition_embedding = get_embedding(definition)
    original_word_embed = fetch_pc_embed(original_word)

    cosine_sim = get_cosine_sim(definition_embedding, original_word_embed)

    return make_response(jsonify({ "definition" : words[original_word], "similarity" : cosine_sim }))

if __name__ == "__main__":
    app.run(debug=True)