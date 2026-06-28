export interface AppItem {
  title: string;
  path: string;
  description: string;
  display: boolean; /* Set to true to show, or false to hide from the UI */
}

export const features: AppItem[] = [
  { 
    title: "🏠 Home", 
    path: "/", 
    description: "Go back to the central landing page dashboard.", 
    display: true 
  },
  { 
    title: "🌤️ Weather App", 
    path: "/weather", 
    description: "Check live forecasts and global weather metrics.", 
    display: true 
  },
  { 
    title: "🎬 Movie Search", 
    path: "/movie", 
    description: "Discover trending films, summaries, and ratings.", 
    display: true 
  },
  { 
    title: "🎮 Play Game", 
    path: "/game", 
    description: "Take a break and test your skills with an interactive game.", 
    display: true 
  },
  { 
    title: "📊 Polls", 
    path: "/poll", 
    description: "Create real-time votes and view community results.", 
    display: true 
  },
  { 
    title: "🤖 AI Chatbot", 
    path: "/ai-transcript", 
    description: "Interact with an AI assistant for quick transcriptions.", 
    display: true /* Turn to false to instantly hide this specific card */
  },
  { 
    title: "Carousel", 
    path: "/carousel", 
    description: "Try out the avaialable carousels", 
    display: false /* Turn to false to instantly hide this specific card */
  },
  { 
    title: "Scheduler", 
    path: "/scheduler", 
    description: "Schedule your tasks", 
    display: true /* Turn to false to instantly hide this specific card */
  },
];
