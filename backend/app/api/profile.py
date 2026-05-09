from fastapi import APIRouter, HTTPException, Depends, Security
from fastapi.security import HTTPAuthorizationCredentials
from ..utils.supabase import get_supabase
from ..core.security import get_current_user, security
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None
    mood_goal: Optional[str] = None
    bio: Optional[str] = None
    triggers: Optional[str] = None
    preferences: Optional[dict] = None
    avatar_url: Optional[str] = None

@router.get("/me")
async def get_my_profile(
    user: dict = Depends(get_current_user),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    try:
        user_id = user["id"]
        client = get_supabase(auth.credentials)
        
        # Try to get from profiles table
        profile_data = await client.get_profile(user_id)
        
        # Merge with auth metadata for fallback
        return {
            "status": "success", 
            "data": {
                "id": user_id, 
                "full_name": profile_data.get("full_name") or user.get("user_metadata", {}).get("display_name", ""),
                "email": user.get("email", ""),
                **profile_data
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/me")
async def update_my_profile(
    profile_update: ProfileUpdate,
    user: dict = Depends(get_current_user),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    try:
        user_id = user["id"]
        client = get_supabase(auth.credentials)
        
        update_data = profile_update.dict(exclude_unset=True)
        data = await client.update_profile(user_id, update_data)
        
        return {
            "status": "success", 
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
