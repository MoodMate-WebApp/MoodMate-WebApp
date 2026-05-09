from pydantic import BaseModel, field_validator

class AnalyzeRequest(BaseModel):
    content: str
    language: str = "English"

    @field_validator("content")
    @classmethod
    def content_must_not_be_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Content cannot be empty.")
        if len(stripped) < 3:
            raise ValueError("Content is too short for analysis.")
        return stripped
