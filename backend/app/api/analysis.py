import anyio
from fastapi import APIRouter, HTTPException, Depends
from ..schemas.analysis import AnalyzeRequest
from ..ai.service import analyze_mood
from ..core.security import get_current_user

router = APIRouter(tags=["Analysis"])

@router.post("/analyze")
async def analyze_text(request: AnalyzeRequest, user: dict = Depends(get_current_user)):
    """
    Authenticated sentiment analysis endpoint.
    Accepts text, returns mood/intensity/confidence/suggestions.
    Now protected and optimized with threadpool.
    """
    try:
        # Run CPU-bound sync inference in a separate thread
        return await anyio.to_thread.run_sync(analyze_mood, request.content, request.language)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        # Log error here in a real app
        raise HTTPException(status_code=500, detail="Internal analysis error.")

@router.get("/health")
async def health():
    return {"status": "ok", "service": "MoodMate AI Engine"}
