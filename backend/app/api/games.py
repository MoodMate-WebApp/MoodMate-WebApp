from fastapi import APIRouter, HTTPException, Depends, Security
from fastapi.security import HTTPAuthorizationCredentials
from ..utils.supabase import get_supabase
from ..core.security import get_current_user, security
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class GameScore(BaseModel):
    game_id: str
    game_name: str
    score: int
    duration: Optional[int] = 0

GAMES_CATALOG = [
    {"id": "bubble-burst", "title": "Bubble Burst", "category": "Relax", "description": "Release cortisol through sensory bubble interaction in a zero-gravity void."},
    {"id": "prana-breathe", "title": "Prana Breathe", "category": "Meditation", "description": "Guided rhythmic breathing (प्राणायाम) to stabilize your heart rate and calm the mind."},
    {"id": "zen-rain", "title": "Zen Rain", "category": "Focus", "description": "Interact with a falling particle stream. Calibrate your attention on fluid dynamics."},
    {"id": "mood-canvas", "title": "Mood Canvas", "category": "Expression", "description": "A minimalist digital canvas to express emotions through color and light without judgment."},
    {"id": "echo-harmony", "title": "Echo Harmony", "category": "Sound", "description": "Create harmonious patterns with gentle sound echoes that synchronize with your pulse."},
    {"id": "focus-pulse", "title": "Focus Pulse", "category": "Focus", "description": "Maintain your center as concentric neural rings expand and contract in rhythm."},
    {"id": "emotion-sort", "title": "Emotion Sort", "category": "Cognitive", "description": "Connect Marathi emotional nuances to their corresponding color frequencies."},
    {"id": "celestial-drift", "title": "Celestial Drift", "category": "Relax", "description": "Guide a lone star through a deep space nebula. High-fidelity cosmic relaxation."},
    {"id": "starlight-connect", "title": "Starlight Connect", "category": "Cognitive", "description": "Unite distant stars to form ancient constellations. Focus and pattern recognition."},
    {"id": "nature-loop", "title": "Nature Loop", "category": "Sound", "description": "Immersive Marathi nature soundscapes paired with procedural high-end visuals."}
]

@router.get("/catalog")
async def get_catalog():
    return {"status": "success", "data": GAMES_CATALOG}

@router.post("/scores")
async def save_score(
    score: GameScore,
    user: dict = Depends(get_current_user),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    try:
        user_id = user["id"]
        client = get_supabase(auth.credentials)
        
        score_data = score.dict()
        score_data["user_id"] = user_id
        
        # We'll save this in a game_scores table
        data = await client.save_game_score(score_data)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_game_stats(
    user: dict = Depends(get_current_user),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    try:
        user_id = user["id"]
        client = get_supabase(auth.credentials)
        data = await client.get_game_stats(user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
