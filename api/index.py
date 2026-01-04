from fastapi import FastAPI
from api.backend.main import ask_question
from api.backend.utils.helpers import format_statement_data
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=origins,
    allow_headers=origins
)

class QuestionRequest (BaseModel):
    question: str

@app.get("/api/py/statement/")
def hello_fast_api():
    return {"result": format_statement_data()}

@app.post("/api/py/ask/")
def hello_fast_api(req: QuestionRequest):
    response = ask_question(req.question)
    return {"answer": response}
