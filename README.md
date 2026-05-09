# 🧠 MoodMate — The Future of Emotional Intelligence

MoodMate is a premium, high-fidelity emotional analytics platform designed for the 2026 wellness market. It leverages state-of-the-art NLP models to decode emotional nuances in **Marathi, Hindi, and English**, providing users with actionable wellness insights, interactive engagement modules, and a cinematic digital sanctuary.

![MoodMate Hero](frontend/public/hero-preview.png)

## 🚀 Core Intelligence

- **🧠 Multi-Lingual Neural Engine**: Specialized Transformer-based sentiment analysis for regional nuances (Marathi & Hindi) alongside English.
- **🎨 Cinematic Glassmorphism**: A state-of-the-art design system featuring depth-aware layers, intelligent theme persistence, and fluid animations.
- **📊 Emotional Bento-Grid**: A sophisticated dashboard delivering real-time statistics, mood velocity tracking, and trend visualization.
- **🎮 Zen Garden**: Mood-responsive mini-games (Bubble Burst, Breathing Sync) designed for immediate emotional grounding and stress reduction.
- **🛡️ Privacy-First Architecture**: Secure data isolation using Supabase RLS and JWT-based authentication.

---

## 🛠️ Technology Stack

### **Frontend (The Experience)**
- **Framework**: [Next.js 15](https://nextjs.org/) / React 19
- **Logic**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Vanilla CSS Variables (Adaptive Design System)
- **Animations**: Framer Motion (High-Fidelity UI Transitions)
- **Visualization**: Recharts (Custom Gradient Integration)

### **Backend (The Brain)**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (JWT & Role-Based Access Control)
- **AI/ML**: Hugging Face Transformers + Torch Inference Engine
- **Validation**: Pydantic v2

---

## 📂 Architecture Overview

```text
MoodMate-WebApp/            # (This Repository - Core Web App Codebase)
├── backend/                # FastAPI Microservice (Python)
│   ├── app/
│   │   ├── ai/            # Neural Models & Sentiment Logic
│   │   ├── api/           # RESTful Endpoints (v1)
│   │   ├── core/          # Security, JWT, & Environment Config
│   │   ├── models/        # Database Schema Definitions
│   │   ├── services/      # Core Business Logic & Supabase Integrations
│   │   └── utils/         # Performance Helpers & Threading
├── frontend/               # Next.js Application (TypeScript/React)
│   ├── src/
│   │   ├── components/    # Reusable Glassmorphic UI Components
│   │   ├── context/       # Global State (Auth, Preferences, Mood)
│   │   ├── pages/         # High-Fidelity Route Components
│   │   └── services/      # Axios-based API Communication Layer
└── .env.example            # Environment Configuration Template

# Note: The following directories are maintained locally in the parent directory
# for separation of concerns and to keep the git repository lightweight:
../
├── docs/                   # Academic Reports, Presentations, and Architecture Outlines
├── ml_pipeline/            # AI Training Data and Jupyter Notebooks
│   ├── dataset/           # Raw and processed CSV datasets
│   └── notebooks/         # Model training code and model.pdf
└── design/                 # High-fidelity UI mockups and SVG assets
```

---

## ⚡ Quick Start

### **1. Spin up the Backend**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **2. Launch the Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **3. Configuration**
Rename `.env.example` to `.env` in both directories and provide your **Supabase URL** and **Anon Key**.

---

## 🌐 Deployment (Team Strategy)

This project uses a **Hybrid Deployment** strategy to handle the large AI model (2.2GB) while maintaining a fast UI.

### **1. Backend Deployment (Hugging Face Spaces)**
*   **Purpose**: Hosts the FastAPI server and the 2.2GB AI model.
*   **Steps**:
    1.  Create a new Space on Hugging Face (Select **Docker** SDK).
    2.  Clone the Space repository locally.
    3.  Copy the contents of the `backend/` folder into the Space repo.
    4.  **Include** the `backend/app/ai/models/model.safetensors` file in the push to Hugging Face (it supports large files via LFS).
    5.  Set your Supabase Environment Variables in the HF Space **Settings > Variables**.

### **2. Frontend Deployment (Vercel)**
*   **Purpose**: Hosts the Next.js/Vite application.
*   **Steps**:
    1.  Push the clean `MoodMate-WebApp` codebase to GitHub (the model is ignored by `.gitignore`).
    2.  Import the repo into Vercel.
    3.  Set `VITE_API_URL` to your Hugging Face Space URL (e.g., `https://username-moodmate-api.hf.space`).
    4.  Set your Supabase `VITE_` variables in Vercel.

---

## 👥 Core Collective

MoodMate was engineered with passion by a specialized team of developers and designers:

- **Rohan Baviskar** — Lead Engineer (Full-Stack Systems & AI Integration)
- **Harshada Bodavade** — AI Strategist (Neural Sentiment & Cognitive Logic)
- **Aayushi Chaudhari** — Design Director (Interface Psychology & Immersive UX)
- **Ujjwal Patil** — Backend Architect (Scalability & Data Security)

---

## ⚖️ License & Security
MoodMate is built for the **College Major Project 2026**. All data processing is done with user privacy as the highest priority, utilizing encrypted sessions and anonymized sentiment tracking.

👉 *MoodMate: Understand Emotions. Instantly.*
