import modal
import json

LawDeepSeekModel = modal.Cls.from_name("law-deepseek-r1", "LawDeepSeekModel")

model = LawDeepSeekModel()

def sse_ask_question(question: str):
    """
    Stream response from Modal in Server-Sent Events format
    """
    # Create model instance for this request
    model = LawDeepSeekModel()
    
    try:
        for chunk in model.generate_stream.remote_gen(question):
            # Format as proper SSE with data: prefix
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        
        # Send completion signal
        yield f"data: {json.dumps({'done': True})}\n\n"
        
    except Exception as e:
        # Send error as SSE
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
