import os, asyncio

from langchain_ollama.llms import OllamaLLM
from pydantic import BaseModel
# from api.backend.utils.vector import retriever
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy


load_dotenv()

model_name = os.getenv("BASE_MODEL_NAME")
model = OllamaLLM(model=model_name)

template = """
You are a expert legal consultant in Rwanda that can answer questions about the Rwandan laws and regulations.

Please answer the user's question and format the response in an easy to parse markdown.
"""
class AiResponse(BaseModel):
    answer: str

def ask_question(question: str) -> str:
    """
    Function to directly call the model and print the generated response.
    """
    agent = create_agent(
        model=model,
        system_prompt=template, 
        # response_format=ToolStategy(AiResponse)
    )
    result = agent.invoke({"messages": [{"role": "user","content": question}]})
    return result

async def sse_ask_question(question: str):
    """
    An async generator that yields SSE-formatted messages as the AI outputs them.
    """
    agent = create_agent(model=model, tools=[], system_prompt=template)
    
    try:
        for chunk in agent.stream(
            {"messages": [{"role": "user", "content": question}]}, 
            stream_mode="updates"
        ):
            for _, data in chunk.items():
                # Extract the text content
                text_content = data['messages'][-1].content_blocks.get('text', '')
                # Format as SSE event
                yield f"data: {text_content}\n\n"
        
        # Send completion signal
        yield "data: [DONE]\n\n"
        
    except Exception as e:
        # Send error to client
        yield f"data: [ERROR] {str(e)}\n\n"
