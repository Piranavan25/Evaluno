from fastapi import APIRouter, HTTPException
from schemas.interview import (InterviewQnARequest, InterviewQnAResponse)
from services.llm import chain
import json
from database.connection import cv_results


router = APIRouter(prefix="/interview", tags=["interview"])

@router.post("/", response_model=InterviewQnAResponse)
async def generate_interview_qna(request: InterviewQnARequest):
    try:
        # invoke the chain
        parsed = await chain.ainvoke({
            "cv_text": request.cv_text,
            "job_title": request.job_title,
            "job_requirements": request.job_requirements,
            "job_description": request.job_description
        })
        # parsed is already a dict matching InterviewQnAResponse
        items = json.loads(parsed)

        await cv_results.insert_one({
            "user_id": request.user_id,
            "AIResponse": items
        })

        return {"items": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {e}")