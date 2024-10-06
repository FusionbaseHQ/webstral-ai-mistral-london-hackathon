import requests
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.chat_models import ChatCompletionRequest, ChatCompletionResponse
from app.models.agent import AgentRequest
from fastapi.responses import StreamingResponse
from app.services.execution import ExecutionEngine, LLMService
from app.services.execution import Guidance
from app.utils.brave import transform_results

router = APIRouter(
    prefix="/v1",
    tags=["Chat Completions"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/agent/create",
   # response_model=ChatCompletionResponse,
    status_code=status.HTTP_200_OK,
    summary="Creates a new data agent",
    description="Creates a new data agent",
)
def create_data_agent(agent_request: AgentRequest):
    
    # Get input dict prompt
    guidance_dict = Guidance.get_guidance_dict(agent_request.prompt)
    engine = ExecutionEngine(guidance_dict)

    def event_stream():

        # Title
        try:
            title = step_message = LLMService.get_response({}, "", title_prompt=agent_request.prompt)
            yield f'<title: {title.get("title")}>'
        except Exception as e:
            pass
        
        try:
            for message in engine.execute():
                # Optionally, format the message as JSON or any other format
                yield message
        except Exception as e:
            yield f"Unexpected error: {e}\n"

    return StreamingResponse(event_stream(), media_type="text/plain")

    
      
@router.get("/brave/search")
def brave_search(q: str):
    headers = {
        "x-subscription-token": os.getenv("BRAVE_API_KEY")
    }
    response = requests.get(f"https://api.search.brave.com/res/v1/web/search?q={q}", headers=headers)
    results = response.json()
    results = transform_results(results)
    return results
