from typing import List, Optional
from pydantic import BaseModel, Field


class AgentRequest(BaseModel):
   # model: str = Field("mistal-large-latest", description="Model ID to use for generating chat completions.")
    name: str = Field("Agent", description="Name of the agent.")
    prompt: str = Field("...", description="Prompt to define the agent.")

