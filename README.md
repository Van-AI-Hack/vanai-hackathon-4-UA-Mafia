# Canadian Music DNA 

## Project Overview 

Canadian Music DNA is an innovative AI-powered platform that analyzes and categorizes Canadian music listeners into distinct personas based on their musical preferences, discovery methods, and attitudes toward technology. Our platform transforms the complex landscape of Canadian music culture into an engaging, interactive experience that helps users discover their unique musical identity.

The project addresses the challenge of understanding how Canadians consume and interact with music in the digital age. Through a comprehensive survey analysis of over 1,000 Canadian music listeners, we've identified five distinct music personas: The Radio Traditionalist, The Digital Explorer, The Casual Listener, The Music Obsessive, and The AI Skeptic. Each persona represents different approaches to music discovery, consumption patterns, and attitudes toward emerging technologies like AI-generated music.

Our platform features an interactive quiz that uses machine learning algorithms to classify users into these personas based on their responses to questions about music discovery methods, AI attitudes, listening habits, and demographic information. The results are presented through stunning visualizations including interactive charts, persona comparisons, and detailed analytics dashboards.

Beyond individual analysis, Canadian Music DNA fosters community by connecting users with similar musical tastes through our "Music Twin" feature, enabling users to find like-minded music enthusiasts across Canada. The platform also includes AI-powered music recommendations, lyric generation capabilities, and comprehensive data visualization tools that make music psychology accessible and engaging.

The project combines cutting-edge web technologies with sophisticated data analysis to create a unique digital experience that celebrates Canadian music culture while providing valuable insights into the evolving landscape of music consumption in the digital age.

## Tech Notes 

Canadian Music DNA is built on a modern, full-stack architecture designed for scalability and performance. The frontend is constructed using React 18 with TypeScript, providing type safety and enhanced developer experience. We utilize Vite as our build tool for fast development and optimized production builds, while Tailwind CSS ensures consistent, responsive design across all devices.

The application employs advanced data visualization through Plotly.js, enabling interactive charts including Sankey diagrams, radar charts, and demographic heatmaps. These visualizations are powered by real survey data from over 1,000 Canadian music listeners, processed through custom machine learning algorithms that classify users into distinct music personas.

For state management and user interactions, we implement React Context API and custom hooks, ensuring efficient data flow and component communication. The platform features real-time audio capabilities using Web Audio API and custom audio management systems, allowing users to experience persona-specific soundtracks and ambient audio.

The backend infrastructure leverages Supabase for database management and real-time data synchronization, while Cloudinary handles image and media asset management. We implement secure API integrations with external services for music streaming and AI-powered features.

Performance optimization is achieved through code splitting, lazy loading, and efficient bundle management. The application is fully responsive, with mobile-first design principles ensuring optimal user experience across all devices. We utilize Progressive Web App (PWA) technologies for offline functionality and app-like user experience.

Security is prioritized through environment variable management, API key protection, and secure data handling practices. The platform includes comprehensive error handling, loading states, and user feedback systems to ensure a smooth, professional user experience.

Deployment is handled through Vercel with automated CI/CD pipelines, ensuring rapid iteration and reliable production deployments. The entire stack is containerized and optimized for cloud deployment, providing scalability and reliability for growing user bases.

## Team Members

| Team Member | Contact Information |
|-------------|-------------------|
| **Andrii Kavetskyi** | Email: andriykavetsky@gmail.com<br>Phone: 672 472 0995 |
| **Taras Havrylyukh** | Email: taras.havrylyukh@gmail.com<br>Phone: +1 236 979 1129 |

## Features

- 🎵 AI-powered music persona classification
- 📊 Interactive data visualizations and analytics
- 🤝 Music Twin matching system
- 🎧 Persona-specific audio experiences
- 📱 Mobile-responsive design
- 🎨 Modern cyberpunk UI/UX
- 🔒 Secure user data handling
- ⚡ Real-time updates and synchronization

## Live Demo

🌐 **Production URL**: https://web-iwx9owi73-andriis-projects-c4c7c4ed.vercel.app

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Data Visualization**: Plotly.js, Chart.js
- **Backend**: Supabase, Node.js
- **Audio**: Web Audio API, Custom Audio Manager
- **Deployment**: Vercel
- **Media**: Cloudinary

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

### 🚀 Quick Start

**Development Server:**
```bash
cd web
npm install
npm run dev
# Open http://localhost:5173
```

**Production Build:**
```bash
cd web
npm run build
npm run preview
# Open http://localhost:4173
```

### 🔐 Environment Variables

Copy `web/env.example` to `web/.env` and provide the Supabase + AI credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CHATGPT_API_KEY=your_openai_api_key
VITE_SUNO_API_KEY=your_suno_api_key
```

These keys are bundled into the AI Studio so the UI no longer asks for manual entry. Update them before running the lyric generator or Suno track builder.

### 🗄️ Database Setup

Run the statements in `web/DATABASE_SETUP.sql` inside your Supabase SQL editor to provision the `buddy_personas` and `suno_requests` tables along with their policies.

### 🎯 What This Is

A cutting-edge, AI-powered web application that analyzes users' music preferences and classifies them into distinct Canadian music personas. Built with modern web technologies, real survey data from 1,006 Canadian music listeners, and advanced AI features.

### ✨ Key Features

- **🤖 AI-Powered Analysis** - Dynamic persona descriptions and music recommendations
- **📊 Real Data Integration** - 1,006 actual Canadian music survey responses
- **🎭 5 ML-Generated Personas** - Scientifically classified music personality types
- **📱 PWA Support** - Install as mobile app with offline functionality
- **🎨 Interactive Dashboard** - 5 comprehensive analytics tabs with real visualizations
- **💬 AI Chat Assistant** - Ask questions about your music DNA
- **📤 Export & Sharing** - Generate PNG/SVG persona cards and social sharing
- **♿ Accessibility** - WCAG 2.1 AA compliant with screen reader support
- **⚡ Performance** - 90+ Lighthouse score with optimized loading

### 🎭 The 5 Music Personas

1. **The Radio Traditionalist** (25.4%) - Discovered music through radio, values authenticity
2. **The Digital Explorer** (22.3%) - Embraces digital discovery, open to AI music
3. **The Casual Listener** (20.1%) - Enjoys music for relaxation and background
4. **The Music Obsessive** (18.7%) - Passionate about music, actively seeks discoveries
5. **The AI Skeptic** (13.5%) - Prefers human-made music, uncomfortable with AI voices

### 📊 Key Insights from Real Data

- **56.8%** discovered music through **the radio**
- **64.0%** prefer human-made over AI-generated music
- **78%** listen to music while **commuting**
- **89%** use music for **unwinding**
- **Ontario** leads with **48.3%** of survey responses

### 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **Charts**: Plotly.js for interactive visualizations
- **AI**: Custom AI service with TTS and LLM integration
- **PWA**: Service Worker + Web App Manifest
- **Data**: 1,006 real Canadian music survey responses
- **Performance**: 90+ Lighthouse score, optimized bundles

### 🎯 Project Phases Completed

#### ✅ Phase 1: Real Data Integration
- Connected 1,006 real Canadian music survey responses
- Integrated 5 ML-generated personas with detailed characteristics
- Created interactive charts with actual statistics
- Implemented dynamic persona classification

#### ✅ Phase 2: Enhanced User Experience
- Added PNG/SVG export functionality for persona cards
- Implemented social sharing across major platforms
- Created local storage for returning users
- Built welcome back screen with saved results

#### ✅ Phase 3: AI Integration Features
- Developed AI service layer with LLM integration
- Added dynamic persona descriptions and fun facts
- Created AI music recommendations system
- Built floating chat interface for music DNA questions
- Implemented TTS narration for accessibility

#### ✅ Phase 5: Production & Performance
- Added PWA support for mobile app installation
- Optimized performance with 90+ Lighthouse score
- Implemented comprehensive SEO optimization
- Ensured WCAG 2.1 AA accessibility compliance
- Created performance monitoring dashboard

### 📁 Project Structure

```
canadian-music-dna/
├── web/                           # React frontend application
│   ├── public/
│   │   ├── manifest.json          # PWA manifest
│   │   ├── sw.js                  # Service worker
│   │   └── icons/                 # PWA icons
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── services/              # AI and data services
│   │   ├── utils/                 # Utility functions
│   │   └── App.tsx                # Main application
│   ├── package.json               # Dependencies
│   └── vite.config.ts             # Build configuration
├── analysis/                      # Python analysis scripts
│   ├── persona_clustering.py
│   ├── sentiment_enhanced.py
│   └── enhanced_visualizations.py
├── data_analysis/                 # Data analysis and documentation
├── PROJECT_COMPLETION_REPORT.md   # Detailed project report
└── README.md                      # This file
```

### 🎵 How It Works

1. **Take the Quiz** - Answer 5 questions about your music preferences
2. **AI Analysis** - Get dynamic AI-generated persona description
3. **View Results** - See your music DNA with interactive visualizations
4. **Explore Dashboard** - Dive into comprehensive analytics
5. **Export & Share** - Generate persona cards and share results
6. **Chat with AI** - Ask questions about your music taste

### 🚀 Deployment Options

**Netlify (Recommended):**
```bash
cd web
npm run build
# Deploy dist/ folder to Netlify
```

**Vercel:**
```bash
cd web
npx vercel --prod
```

**GitHub Pages:**
```bash
cd web
npm run build
# Push dist/ to gh-pages branch
```

---

*Built for the Vancouver BC AI Hackathon - Round 4: The Soundtrack of Us*
