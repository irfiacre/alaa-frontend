from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

from api.backend.main import sse_ask_question

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Changed from origins to ["*"]
    allow_headers=["*"],  # Changed from origins to ["*"]
)

class QuestionRequest(BaseModel):
    question: str
    max_new_tokens: int | None = None  # Optional parameter
    temperature: float = 0.7  # Optional parameter

@app.get("/api/health-check/")
def hello_fast_api():
    return {"message": "API is running successfully"}

@app.post("/api/sse/")
async def sse_chat_with_model(req: QuestionRequest):
    """
    Stream chat responses using Server-Sent Events
    """
    return StreamingResponse(
        sse_ask_question(req.question),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Disable proxy buffering
            "Connection": "keep-alive",
        }
    )
