import httpx
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings

from typing import Optional

security = HTTPBearer(auto_error=False)

async def get_current_user(auth: Optional[HTTPAuthorizationCredentials] = Security(security)):
    """
    Verifies the JWT token with Supabase Auth API.
    Returns the user data or None if guest/invalid.
    """
    if not auth:
        return None

    token = auth.credentials
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.SUPABASE_URL}/auth/v1/user",
                headers={
                    "apikey": settings.SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {token}"
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                # Log specific error if unauthorized
                if response.status_code == 401:
                    raise HTTPException(
                        status_code=401,
                        detail=f"Supabase Auth Error: {response.json().get('msg', 'Unauthorized')}",
                        headers={"WWW-Authenticate": "Bearer"},
                    )
    except HTTPException:
        raise
    except Exception:
        pass
        
    raise HTTPException(
        status_code=401,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )

async def get_authenticated_user(user: Optional[dict] = Depends(get_current_user)):
    """
    Ensures that a user is actually logged in.
    """
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required for this action",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
