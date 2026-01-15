import modal

LawDeepSeekModel = modal.Cls.from_name("law-deepseek-r1", "LawDeepSeekModel")

model = LawDeepSeekModel()

def sse_ask_question(question: str):
    for chunk in model.generate_stream.remote_gen(question):
        yield chunk
