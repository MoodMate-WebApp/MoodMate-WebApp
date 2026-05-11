from fastapi import APIRouter, HTTPException, Depends, Security
from fastapi.security import HTTPAuthorizationCredentials
from ..utils.supabase import get_supabase
from ..core.security import get_current_user, security
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class JournalEntry(BaseModel):
    text: str
    emotion: str
    mood: str
    color_code: str
    intensity: int
    language: str = "English"

@router.get("/entries")
async def get_entries(
    user: dict = Depends(get_current_user),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    try:
        user_id = user["id"]
        client = get_supabase(auth.credentials)
        data = await client.get_entries(user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_stats(
    user: dict = Depends(get_current_user),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    try:
        user_id = user["id"]
        client = get_supabase(auth.credentials)
        entries = await client.get_entries(user_id)
        
        # Aggregate on server
        total = len(entries)
        positive = len([e for e in entries if 'positive' in (e.get('mood') or '').lower() or 'happy' in (e.get('mood') or '').lower()])
        negative = len([e for e in entries if 'negative' in (e.get('mood') or '').lower() or 'sad' in (e.get('mood') or '').lower()])
        neutral = total - positive - negative
        
        # Calculate Streak
        streak = 0
        if entries:
            from datetime import datetime, timedelta
            # Sort by date
            dates = sorted(list(set([datetime.fromisoformat(e['created_at'].replace('Z', '+00:00')).date() for e in entries])), reverse=True)
            
            today = datetime.now().date()
            current = today
            
            # If latest entry is not today or yesterday, streak is 0
            if dates and (dates[0] == today or dates[0] == today - timedelta(days=1)):
                for d in dates:
                    if d == current:
                        streak += 1
                        current -= timedelta(days=1)
                    elif d > current:
                        continue
                    else:
                        break
        
        return {
            "status": "success",
            "data": {
                "total": total,
                "positive": positive,
                "negative": negative,
                "neutral": neutral,
                "streak": streak,
                "entries": entries[:100]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/entries")
async def create_entry(
    entry: JournalEntry,
    user: dict = Depends(get_current_user),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    try:
        user_id = user["id"]
        client = get_supabase(auth.credentials)
        
        entry_dict = entry.dict()
        entry_dict["user_id"] = user_id
        
        data = await client.create_entry(entry_dict)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/entries/{entry_id}")
async def delete_entry(
    entry_id: str,
    user: dict = Depends(get_current_user),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    try:
        user_id = user["id"]
        client = get_supabase(auth.credentials)
        await client.delete_entry(entry_id, user_id)
        return {"status": "success", "message": "Entry deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
