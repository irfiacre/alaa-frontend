from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from api.backend.utils.vector import retriever

model = OllamaLLM(model="llama3.2")

template = """
You are a financial expert in analyzing and answering questions about any bank statement

Here are some bank statement transaction records: {records}

Here is a question to answer: {question}, Please format the response in an easy to parse markdown.
"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

def ask_question(question: str) -> str:
    result = chain.invoke({
        "records": retriever.invoke(question),
        "question": question
    })

    return result
