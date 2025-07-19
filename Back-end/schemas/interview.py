from pydantic import BaseModel
from typing import List

class InterviewQnARequest(BaseModel):
    user_id: str
    cv_text: str
    job_title: str
    job_requirements: str
    job_description: str

class QAItem(BaseModel):
    question: str
    answer: str
    difficulty: str  # e.g. "easy", "medium", "hard"

class InterviewQnAResponse(BaseModel):
    items: List[QAItem]