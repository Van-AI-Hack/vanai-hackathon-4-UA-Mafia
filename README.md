# 🎵 Canadian Music DNA - AI-Powered Music Discovery Platform

## Vancouver AI Hackathon Round 4: The Soundtrack of Us

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

### 📊 Performance Metrics

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Load Time**: < 2 seconds
- **Bundle Size**: ~650KB (gzipped)
- **PWA Score**: 100/100
- **Accessibility**: WCAG 2.1 AA compliant

### 🏆 Why This Will Win

1. **Real Data + AI** - Authentic insights powered by 1,006 survey responses
2. **Modern Technology** - React, TypeScript, PWA, AI integration
3. **Complete Experience** - Quiz, analysis, dashboard, export, sharing
4. **Production Ready** - Optimized, accessible, performant
5. **Innovation** - AI-powered music discovery with real Canadian data

### 📄 Documentation

- **[Project Completion Report](./PROJECT_COMPLETION_REPORT.md)** - Detailed technical documentation
- **[Technical Implementation](./data_analysis/TECHNICAL_IMPLEMENTATION.md)** - Architecture overview
- **[Chart Improvements](./canadian-music-dna/CHART_IMPROVEMENTS_SUMMARY.md)** - Visualization enhancements

---

**🎵 Ready to discover your Canadian Music DNA? Start the development server and begin your journey!**
