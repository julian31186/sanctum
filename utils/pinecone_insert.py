from pinecone import Pinecone
from dotenv import load_dotenv
import os
import json

load_dotenv()
pc = Pinecone(api_key=os.environ.get("PINCONE_KEY"))
index = pc.Index("sanctum")
embeds = "../embeds.json"

def load_pinecone():
    batch_num = 0
    with open(embeds,'r') as f:
        data = json.load(f)
        for i in range(0,len(data),10):
            index.upsert(data[i:i + 10])
            print(f'Uploaded batch number -> {batch_num}')
            batch_num += 1

load_pinecone()