from transformers import pipeline  # type: ignore
from typing import Dict, Any
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_NAME = os.path.join(BASE_DIR, "models")

# Load model at module level (singleton)
sentiment_ai = pipeline(  # type: ignore
    "sentiment-analysis",
    model=MODEL_NAME,
    tokenizer=MODEL_NAME,
    top_k=None
)


# ---------------- HELPERS ----------------

def clamp(v: int, min_v: int = 1, max_v: int = 10) -> int:
    return max(min_v, min(max_v, v))


# ---------------- ENGLISH MAPS ----------------

ENG_EMOTION_MAP = {
    "positive": "Happy",
    "negative": "Sad",
    "neutral": "Neutral",
}

ENG_SUMMARY_MAP = {
    "positive": "You're feeling emotionally positive today.",
    "negative": "You seem emotionally overwhelmed today.",
    "neutral": "Your mood feels calm and balanced.",
}

ENG_TIPS_MAP = {
    "positive": ["Celebrate small wins", "Share your happiness"],
    "negative": ["Pause and breathe", "Talk to someone you trust"],
    "neutral": ["Reflect calmly", "Plan something meaningful"],
}

# ---------------- MARATHI MAPS ----------------

MAR_EMOTION_MAP = {
    "positive": "आनंदी",
    "negative": "दुःखी",
    "neutral": "शांत/तटस्थ",
}

MAR_SUMMARY_MAP = {
    "positive": "तुम्हाला आज खूप सकारात्मक आणि उत्साही वाटत आहे.",
    "negative": "तुम्ही थोडे अस्वस्थ किंवा दुःखी असल्याचे जाणवत आहे. स्वतःची काळजी घ्या.",
    "neutral": "तुमची मनःस्थिती आज संतुलित आणि शांत आहे.",
}

MAR_TIPS_MAP = {
    "positive": ["ही आनंदाची क्षणे साजरी करा", "तुमचा आनंद इतरांसोबत शेअर करा"],
    "negative": ["दीर्घ श्वास घ्या आणि थोडा वेळ विश्रांती घ्या", "तुमच्या जवळच्या व्यक्तीशी बोला"],
    "neutral": ["आजचा दिवस नियोजित करा", "शांतपणे विचार करा"],
}

# ---------------- GLOBAL MAPS ----------------

EMOJI_MAP = {
    "positive": "😊",
    "negative": "😔",
    "neutral": "😐",
}

COLOR_MAP = {
    "positive": "#22c55e",
    "negative": "#ef4444",
    "neutral": "#facc15",
}


# ---------------- MAIN ----------------

def analyze_mood(text: str, language: str = "English") -> Dict[str, Any]:
    text = text.strip()
    if not text:
        raise ValueError("Text cannot be empty.")

    is_marathi = language.lower() in ["marathi", "mr"]

    try:
        results = sentiment_ai(text)[0]  # type: ignore
        scores = {r["label"].lower(): float(r["score"]) for r in results}

        # Primary prediction (top)
        label = results[0]["label"].lower()
        score = float(results[0]["score"])

        # Normalize to sentiment key
        if label == "positive":
            sentiment = "positive"
        elif label == "negative":
            sentiment = "negative"
        else:
            sentiment = "neutral"

        # Intensity calculation
        neutral_score = scores.get("neutral", 0.0)

        if sentiment == "neutral":
            intensity = 4 - round(score * 2)
        else:
            diff = score - neutral_score
            intensity = 5 + round(diff * 5)

        intensity = clamp(intensity, 2, 10)

        # Select Maps
        emotion_map = MAR_EMOTION_MAP if is_marathi else ENG_EMOTION_MAP
        summary_map = MAR_SUMMARY_MAP if is_marathi else ENG_SUMMARY_MAP
        tips_map = MAR_TIPS_MAP if is_marathi else ENG_TIPS_MAP

        return {
            "sentiment": sentiment.capitalize(),
            "emotion": emotion_map[sentiment],
            "confidence": round(score, 3),
            "intensity": intensity,
            "emoji": EMOJI_MAP[sentiment],
            "summary": summary_map[sentiment],
            "coping_suggestions": tips_map[sentiment],
            "color_code": COLOR_MAP[sentiment],
        }

    except Exception:
        return {
            "sentiment": "Neutral",
            "emotion": "शांत" if is_marathi else "Neutral",
            "confidence": 0,
            "intensity": 3,
            "emoji": "❓",
            "summary": "विश्लेषण अयशस्वी. पुन्हा प्रयत्न करा." if is_marathi else "Mood analysis failed. Please try again.",
            "coping_suggestions": ["पुन्हा प्रयत्न करा"] if is_marathi else ["Try again with different phrasing"],
            "color_code": "#facc15",
        }
