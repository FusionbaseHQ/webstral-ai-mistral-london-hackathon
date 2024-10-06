from typing import List, Optional
from pydantic import BaseModel, Field


class Message(BaseModel):
    role: str = Field(..., description="Role of the message author (e.g., 'user', 'assistant').")
    content: str = Field(..., description="Content of the message.")


class ChatCompletionRequest(BaseModel):
    model: str = Field("mistral-large-latest", description="Model ID to use for generating chat completions.")
    messages: List[Message] = Field(..., description="List of messages forming the conversation.")
    temperature: Optional[float] = Field(1.0, ge=0.0, le=2.0, description="Sampling temperature.")
    max_tokens: Optional[int] = Field(150, ge=1, description="Maximum number of tokens to generate.")
    top_p: Optional[float] = Field(1.0, ge=0.0, le=1.0, description="Nucleus sampling probability.")
    n: Optional[int] = Field(1, ge=1, description="Number of chat completion choices to generate.")


class Choice(BaseModel):
    index: int
    message: Message
    finish_reason: Optional[str]


class ChatCompletionResponse(BaseModel):
    id: str
    object: str
    created: int
    choices: List[Choice]
    usage: Optional[dict]
