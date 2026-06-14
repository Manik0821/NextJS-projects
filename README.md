# Full-Stack Modular Playground (Next.js 15+ & Nvidia NIM)

A highly optimized, full-stack Next.js production platform built with a scale-ready, domain-driven architecture. This repository serves as a portfolio project demonstrating clean software patterns, advanced type safety, centralized state management, third-party API integrations, and artificial intelligence capabilities.

🔗 **Live Production URL:** [Paste Your Vercel Deployment Link]

---

# 🛠 Architecture & Design Decisions

This application intentionally moves beyond basic file-routing layouts and adopts a scalable **Feature-Driven Architecture (Co-location)**.

## Why this structure scales

* **Separation of Concerns**

  * `src/app` contains route controllers and API gateways only.
  * UI and business logic are organized inside isolated feature modules.

* **Domain Co-location**

  * Features such as Movies, Weather, AI Chat, Game Engine, and Carousel maintain their own components, helpers, hooks, and styling.

* **Unified Imports**

  * Absolute path aliases (`@/*`) remove brittle relative imports and mirror enterprise-scale projects.

```text
src
├── app/                    # Route Controllers & API Endpoints
│   ├── api/
│   ├── weather/
│   ├── movie/
│   ├── game/
│   └── ai-transcript/
│
├── components/             # Shared Reusable Components
├── features/               # Feature Modules
├── lib/                    # Stores, Utilities, Shared Logic
└── styles/
```

---

# 🚀 Feature Implementations

## 🤖 AI Transcript Workspace

Multi-turn conversational assistant powered by:

* Meta Llama 3.3 70B Instruct
* Nvidia NIM Inference API
* OpenAI SDK

### Capabilities

* Stateful conversations
* Context preservation
* Dynamic weather-aware responses
* Reusable AI summary components
* Feature-specific prompt execution

---

## 🌦 Weather Dashboard

Built using the **Open-Meteo API**.

### Current Weather

Displays:

* Temperature
* Relative Humidity
* Wind Speed

### Hourly Visualization

Interactive composed charts showing:

* Temperature
* Humidity
* Wind speed

### 7-Day Forecast

Daily forecast charts with:

* High temperatures
* Low temperatures

### Historical Weather

Archive weather data for previous days using Open-Meteo Historical API.

### AI Weather Insights

Reusable AI summary components generate:

* Climate facts
* Weather observations
* General city insights

---

## 🎬 Movie Discovery Platform

Powered by **TMDB (The Movie Database)** API.

### Live Search

Debounced autocomplete search supporting:

* Movie titles
* Ratings
* Release years

### Movie Detail Profiles

Displays:

* Poster
* Overview
* Runtime
* Genres
* Tagline
* Ratings
* Top cast members

### Recommendation Engine

Uses TMDB's recommendation endpoint:

```http
/movie/{movie_id}/recommendations
```

Provides intelligent recommendations similar to:

* Netflix
* IMDb
* Letterboxd

### Global Movie Synchronization

Managed with Zustand:

* Active movie ID
* Current movie title
* Cross-component updates

---

## 🎮 Interactive Game Section

Contains:

* Custom game logic
* Shared state management
* Component-driven architecture

---

## 🎠 Carousel Module

Reusable image and content carousel system featuring:

* Horizontal scrolling
* Responsive layouts
* Modular styling

---

## 🧠 Reusable AI Summary Engine

Generic LLM container component capable of:

* Accepting prompts dynamically
* Word limit control
* Argument injection
* Feature-level summaries

Used across:

* Weather
* Movies
* Future modules

---

## ⚡ Zustand Reactive State Architecture

Centralized lightweight state management:

* Movie synchronization
* Game state
* Layout behavior
* Active pages
* Cross-component communication

Without unnecessary re-renders.

---

# 💻 Tech Stack

## Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS v4
* PostCSS

## State Management

* Zustand

## Charts & Visualization

* Recharts

## APIs

### Open-Meteo

Used for:

* Current weather
* Hourly forecasts
* Historical weather

### TMDB API

Used for:

* Search
* Movie profiles
* Credits
* Recommendation engine

### Nvidia NIM

Running:

* Meta Llama 3.3 70B Instruct

---

# 🔧 Local Setup

## Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create:

```text
.env.local
```

Add:

```env
NVIDIA_API_KEY1=your_nvidia_nim_api_key

TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
```

---

## Start Development Server

```bash
npm run dev
```

---

# 📈 Future Extensions

* Authentication
* Database persistence
* User profiles
* Saved movie watchlists
* AI-powered recommendations
* Vector memory and RAG
* Agentic workflows
* Streaming responses
* Docker deployment
* CI/CD pipelines

---

# 🧩 Core Engineering Principles

* Feature-driven architecture
* Co-location
* Strong typing with TypeScript
* Reusable components
* Serverless API routes
* Separation of concerns
* Centralized state management
* AI-first extensibility
* Production-oriented design

---

Built with:

**Next.js · TypeScript · Zustand · Recharts · TMDB · Open-Meteo · Nvidia NIM · Meta Llama 3.3**
