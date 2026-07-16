from pydantic import BaseModel, Field
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    priority: int = Field(default=5, ge=1, le=10)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    priority: Optional[int] = Field(None, ge=1, le=10)

class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True