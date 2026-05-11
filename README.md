# 🧠 MoodMate — The Future of Emotional Intelligence

MoodMate is a premium, high-fidelity emotional analytics platform designed for the 2026 wellness market. It leverages state-of-the-art NLP models to decode emotional nuances in **Marathi, Hindi, and English**, providing users with actionable wellness insights, interactive engagement modules, and a cinematic digital sanctuary.

![MoodMate Hero](frontend/public/hero-preview.png)

## 🚀 Core Intelligence

- **🧠 Multi-Lingual Neural Engine**: Specialized Transformer-based sentiment analysis for regional nuances (Marathi & Hindi) alongside English, using an optimized XLM-RoBERTa architecture.
- **🎨 Cinematic Glassmorphism**: A state-of-the-art design system featuring depth-aware layers, intelligent theme persistence, and hardware-accelerated fluid animations.
- **📊 Emotional Bento-Grid**: A sophisticated dashboard delivering real-time statistics, mood velocity tracking, and trend visualization via custom Recharts integration.
- **🎮 Zen Garden (Neural Garden)**: Mood-responsive mini-games (Bubble Burst, Prana Breathe, Zen Rain, etc.) designed for immediate emotional grounding and sensory recalibration.
- **📱 Responsive Sensory Interface**: Full mobile and tablet support with touch-optimized interactions and iOS/Android safe-area awareness.
- **🛡️ Privacy-First Architecture**: Secure data isolation using Supabase Row Level Security (RLS) and JWT-based authentication.

---

## 🛠️ Technology Stack

### **Frontend (The Experience)**
- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Logic**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Vanilla CSS (Custom Variable-Driven Design System)
- **Animations**: Framer Motion + Compositor-Thread CSS Keyframes
- **State Management**: React Context API + Custom Hooks
- **Visualization**: Recharts (Custom Gradient Architecture)

### **Backend (The Brain)**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **Security**: SlowAPI (Rate Limiting) + JWT (Supabase Auth Integration)
- **AI/ML**: Hugging Face Transformers + Torch Inference Engine (XLM-RoBERTa)
- **Validation**: Pydantic v2 (Strict Typing)
- **Asynchronous**: Async/Await architecture for non-blocking sentiment analysis

### **Database & Auth**
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (JWT & RBAC)

---

## 📂 Architecture Overview

```text
MoodMate/                   # Core Project Repository
├── backend/                # FastAPI Microservice
│   ├── app/
│   │   ├── ai/            # Neural Models & Sentiment Logic (XLM-RoBERTa)
│   │   ├── api/           # RESTful Endpoints (v1)
│   │   ├── core/          # Security, JWT, & Environment Config
│   │   ├── models/        # Database Schema Definitions
│   │   ├── services/      # Core Business Logic & Supabase Integrations
│   │   └── main.py        # Application Entry Point
├── frontend/               # React Application (TypeScript)
│   ├── src/
│   │   ├── components/    # Glassmorphic UI Components
│   │   ├── context/       # Auth & Settings Management
│   │   ├── pages/         # Route Components (Home, AI, Games, etc.)
│   │   ├── layouts/       # Main Structural Wrappers
│   │   └── services/      # API Communication Layer
└── .env.example            # Environment Configuration Template
```

---

## 🎮 Neural Garden (Games Overview)

MoodMate features a suite of "Neural Garden" modules designed for emotional stabilization:
- **Bubble Burst**: Sensory relief via interactive bubble dynamics.
- **Prana Breathe**: Guided Marathi/English breathing patterns for anxiety reduction.
- **Zen Rain**: Visual rain symphony for cognitive grounding.
- **Emotion Sort**: Gamified emotional markers for cognitive resonance calibration.
- **Celestial Drift**: Interactive starlight navigation for focus enhancement.

---

## ⚡ Setup & Installation

### **1. Environment Configuration**
Copy the template to your local environment:
```bash
cp .env.example .env
```
Fill in your **Supabase URL**, **Anon Key**, and **Database URL**.

### **2. Backend Initialization**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **3. Frontend Initialization**
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment Strategy

MoodMate uses a **Hybrid Deployment** strategy:
- **Backend (Hugging Face Spaces)**: Hosts the FastAPI server and the 2.2GB AI model using Docker & Git LFS.
- **Frontend (Vercel)**: Hosts the React application with optimized CDN delivery.
- **Database (Supabase)**: Managed PostgreSQL with RLS enabled.

---

## 👥 Engineering Team

- **Rohan Baviskar** — Lead Systems Engineer
- **Harshada Bodavade** — AI Strategist
- **Aayushi Chaudhari** — Design Director
- **Ujjwal Patil** — Backend Architect

---

## ⚖️ License & Research Context
MoodMate is a **Major Project 2026** submission. It focuses on the intersection of AI-driven sentiment analysis and immersive sensory UX.

👉 *MoodMate: Understand Emotions. Instantly.*
