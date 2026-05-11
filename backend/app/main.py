"""
MoodMate AI Engine — FastAPI
God Mode Architecture v2.0
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.analysis import router as analysis_router
from .api.journal import router as journal_router
from .api.profile import router as profile_router
from .api.games import router as games_router
from .core.ratelimit import setup_ratelimit
from .core.config import settings

# ---------------- APP INITIALIZATION ----------------

app = FastAPI(
    title="MoodMate AI Engine",
    description="Deep Space Cybernetic Emotional Analytics Platform",
    version="2.1.0"
)
setup_ratelimit(app)

# ---------------- CORS CONFIGURATION ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ROUTER INCLUSION ----------------

app.include_router(analysis_router, prefix="/api/v1")
app.include_router(journal_router, prefix="/api/v1/journal")
app.include_router(profile_router, prefix="/api/v1/profile")
app.include_router(games_router, prefix="/api/v1/games")
app.include_router(analysis_router) # Support legacy path

# ---------------- ROOT ENDPOINT ----------------

@app.get("/")
async def root():
    return {
        "message": "Welcome to MoodMate AI Engine",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
