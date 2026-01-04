from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import pandas as pd
from api.backend.utils.helpers import count_track, STATEMENT_PATH

DB_LOCATION = 'data/chroma_db'
COUNT_PATH = 'data/count.txt'
COLLECTION_NAME = 'bank_transactions'


df = pd.read_csv(STATEMENT_PATH)
embeddings = OllamaEmbeddings(model="mxbai-embed-large")

db_location = DB_LOCATION
add_documents = not os.path.exists(db_location)

if add_documents:
    documents = []
    ids = []
    count = 0
    for i, row in df.iterrows():
        document = Document(
            page_content= (
                str(row["Account"]) + " " +
                str(row["Currency"]) + " " +
                str(row["Reference"]) + " " +
                str(row["Book Date"]) + " " +
                str(row["Value Date"]) + " " +
                str(row["Narration"]) + " " +
                str(row["Credit"]) + " " + 
                str(row["Debit"]) + " " + 
                str(row["Balance"])
            ),
            metadata = {"reference": row["Reference"], "date": row["Value Date"]},
            id = str(i) 
        )
        ids.append(str(i))
        documents.append(document)
        count += 1

    count_track(COUNT_PATH, count)
    


vector_store = Chroma(
    collection_name= COLLECTION_NAME,
    persist_directory= db_location,
    embedding_function=embeddings
)

if add_documents:
    vector_store.add_documents(documents= documents, ids = ids)

retriever = vector_store.as_retriever(
    search_kwargs={"k": count_track(COUNT_PATH)}
)
