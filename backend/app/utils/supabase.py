import httpx
import logging
from fastapi import HTTPException
from ..core.config import settings

logger = logging.getLogger(__name__)

class SupabaseClient:
    def __init__(self, token: str = None):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_ANON_KEY
        
        # If token is provided, we use it for Authorization to trigger RLS
        # Otherwise we use the anon key
        self.auth_header = f"Bearer {token}" if token else f"Bearer {self.key}"
        self.headers = {
            "apikey": self.key,
            "Authorization": self.auth_header,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    async def _handle_response(self, response):
        try:
            response.raise_for_status()
            if response.status_code == 204:
                return []
            return response.json()
        except httpx.HTTPStatusError as e:
            error_data = {}
            try:
                error_data = e.response.json()
            except:
                pass
            
            message = error_data.get("message") or error_data.get("msg") or error_data.get("error_description") or e.response.text
            logger.error(f"Supabase error ({e.response.status_code}): {message}")
            raise HTTPException(status_code=e.response.status_code, detail=f"Supabase API error: {message}")
        except httpx.RequestError as e:
            logger.error(f"Supabase network error: {str(e)}")
            raise HTTPException(status_code=503, detail="Database service unavailable")

    async def get_entries(self, user_id: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.url}/rest/v1/journal_entries?user_id=eq.{user_id}&order=created_at.desc",
                headers=self.headers
            )
            return await self._handle_response(response)

    async def get_profile(self, user_id: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.url}/rest/v1/profiles?id=eq.{user_id}",
                headers=self.headers
            )
            data = await self._handle_response(response)
            return data[0] if data else {}

    async def create_entry(self, entry_data: dict):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.url}/rest/v1/journal_entries",
                headers=self.headers,
                json=entry_data
            )
            return await self._handle_response(response)

    async def delete_entry(self, entry_id: str, user_id: str):
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{self.url}/rest/v1/journal_entries?id=eq.{entry_id}&user_id=eq.{user_id}",
                headers=self.headers
            )
            return await self._handle_response(response)

    async def update_profile(self, user_id: str, profile_data: dict):
        async with httpx.AsyncClient() as client:
            # Upsert into profiles
            headers = {**self.headers, "Prefer": "return=representation,resolution=merge-duplicates"}
            profile_data["id"] = user_id
            
            response = await client.post(
                f"{self.url}/rest/v1/profiles",
                headers=headers,
                json=profile_data
            )
            return await self._handle_response(response)

    async def save_game_score(self, score_data: dict):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.url}/rest/v1/game_scores",
                headers=self.headers,
                json=score_data
            )
            return await self._handle_response(response)

    async def get_game_stats(self, user_id: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.url}/rest/v1/game_scores?user_id=eq.{user_id}&order=created_at.desc",
                headers=self.headers
            )
            return await self._handle_response(response)

def get_supabase(token: str = None):
    return SupabaseClient(token)
