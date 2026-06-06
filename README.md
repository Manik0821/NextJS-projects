# Full-Stack Modular Playground (Next.js 15+ & Nvidia NIM)

A highly optimized, full-stack Next.js production platform built with a scale-ready, domain-driven architecture. This repository serves as a portfolio piece demonstrating clean software patterns, advanced type safety, unified state synchronization, and artificial intelligence model integrations.

🔗 **Live Production URL**: [Paste your Vercel Link Here]

## 🛠️ Architecture & Design Decisions

This application intentionally shifts away from basic file-routing layouts to adopt an enterprise-level **Feature-Driven Architecture (Co-location)**. 

### Why this structure scales:
* **Separation of Concerns**: The `src/app` directory handles pure routing layouts and endpoint configurations. All UI and heavy application mechanics sit isolated within `src/features`.
* **Domain Co-location**: Features like the `game` engine, `carousel` structures, or the `ai-transcript` layer keep their specific sub-components, helper files, and styles directly in their respective feature folders.
* **Unified Import Trees**: Absolute path mappings (`@/*`) avoid brittle relative navigation paths (`../../`), mirroring enterprise-grade configurations.

```text
├── src/
│   ├── app/                # Route Controllers & API Gates Only
│   │   ├── api/            # Serverless Node.js Route Handlers
│   │   └── carousel/       # Structural Route Views
│   ├── components/         # Shared Agnostic Layout Components (Navbar, Header)
│   ├── features/           # Self-Contained Domain Modules (Game, AI Transcript)
│   └── lib/                # Cross-Cutting Shared Logic & State Stores (Zustand)
```

## 🚀 Key Feature Implementations

* **AI Transcript Workspace**: A multi-turn conversation platform powered by **Meta's Llama 3.3 70B Instruct** model via the **Nvidia NIM API**, maintaining natural chat state history across asynchronous API transfers.
* **Zustand Reactive Architecture**: Centralized, light-weight application state layer managing game mechanics, layout behaviors, and active page configurations concurrently without re-rendering waste.
* **Tailwind CSS v4 & PostCSS Core**: Adaptive, high-performance user experience powered by utility-first compilation and strict layout variables.

## 💻 Tech Stack
* **Framework**: Next.js (App Router with Turbopack compilation support)
* **Language**: TypeScript (Strict-mode configuration compliance)
* **Styling**: Tailwind CSS v4, PostCSS, Autoprefixer
* **State Management**: Zustand
* **AI Engine**: OpenAI SDK linked to Nvidia NIM (Inference Microservices)

## 🔧 Local Engineering Setup

1. **Clone the project**:
   ```bash
   git clone [Your Repository URL]
   cd [Your Repository Directory]
   ```
2. **Install local environment packages**:
   ```bash
   npm install
   ```
3. **Configure API parameters** (`.env.local`):
   ```text
   NVIDIA_API_KEY=your_nvidia_api_key_here
   ```
4. **Compile the live environment line**:
   ```bash
   npm run dev
   ```
