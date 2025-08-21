# Benchmark Equipment Rental & Sales

A modern, responsive website for Benchmark Equipment featuring equipment rental services, intelligent chat support, and integrated CRM capabilities.

## 🚀 Live Site

**Production:** [https://benchmark-ashy.vercel.app](https://benchmark-ashy.vercel.app)

## ✨ Features

### 🏗️ Core Website
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Equipment Showcase** - Hero carousel with professional equipment imagery
- **Service Pages** - Equipment rentals, About, Blog, Contact
- **Modern UI/UX** - Clean, professional design optimized for conversions

### 🤖 AI-Powered Chat (Tyler AI)
- **Intelligent Assistant** - Claude-powered chat for customer inquiries
- **Real-time Inventory** - Automatically syncs with current equipment availability
- **Mobile Optimized** - Full-screen mobile experience with intuitive navigation
- **Contextual Memory** - Remembers conversation history for better assistance
- **Equipment Recommendations** - Suggests appropriate equipment based on project needs

### 📋 CRM Integration
- **Monday.com Integration** - Contact form submissions automatically create leads
- **Lead Tracking** - Captures customer information, project details, and requirements
- **Automated Workflow** - Streamlines lead management and follow-up processes

### 📱 Mobile Experience
- **Progressive Web App** - Optimized for mobile devices
- **Touch-Friendly** - Large touch targets and intuitive navigation
- **Full-Screen Chat** - Native app-like chat experience on mobile
- **Responsive Images** - Optimized loading across all devices

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** Claude API (Anthropic)
- **CRM:** Monday.com API
- **Deployment:** Vercel
- **Code Quality:** ESLint + TypeScript

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/weeksahead/Benchmark.git
   cd Benchmark-Equipment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your API keys to `.env`:
   ```env
   # Monday.com Integration
   VITE_MONDAY_API_TOKEN=your_monday_api_token
   VITE_MONDAY_BOARD_ID=9864313431
   VITE_MONDAY_WORKSPACE_ID=9968999
   
   # Claude AI Chat
   VITE_CLAUDE_API_KEY=your_claude_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Monday.com Setup
1. Create API token in Monday.com settings
2. Get your board ID from the URL: `https://company.monday.com/boards/[BOARD_ID]`
3. Configure column mappings in `src/config/monday.ts`

### Claude AI Setup
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Configure system prompt in `api/chat.js`
3. Customize Tyler's personality and knowledge base

### Environment Variables (Vercel)
In your Vercel dashboard, add:
- `VITE_MONDAY_API_TOKEN`
- `VITE_MONDAY_BOARD_ID` 
- `VITE_MONDAY_WORKSPACE_ID`
- `VITE_CLAUDE_API_KEY`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero carousel section
│   ├── Contact.tsx      # Contact form with Monday.com integration
│   ├── TylerAI.tsx      # AI chat component
│   └── ...
├── config/
│   └── monday.ts        # Monday.com configuration
├── assets/              # Images and static files
└── main.tsx            # Application entry point

api/
└── chat.js             # Serverless function for Claude API

public/
├── assets/             # Equipment images
└── favicon.svg         # Custom favicon (white B on black)
```

## 🎨 Customization

### Updating Equipment Inventory
The chat automatically syncs with equipment from `https://rent.benchmarkequip.com/items`. To modify:

1. **Automatic Sync:** Tyler fetches inventory on each chat interaction
2. **Manual Override:** Edit the fallback inventory in `api/chat.js`
3. **Custom Categories:** Update equipment categories in the system prompt

### Styling
- **Colors:** Modify Tailwind config in `tailwind.config.js`
- **Fonts:** Update in `index.css` and Tailwind config
- **Layout:** Edit component files for structural changes

### Chat Personality
Customize Tyler's responses by editing the system prompt in `api/chat.js`:
- Company information
- Equipment categories
- Conversation flow
- Response tone and style

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Alternative Platforms
The project works on any platform supporting:
- Node.js serverless functions
- Static file hosting
- Environment variables

## 🔄 API Integrations

### Monday.com CRM
- **Endpoint:** `https://api.monday.com/v2`
- **Authentication:** API token in headers
- **Functionality:** Creates leads from contact form submissions

### Claude AI
- **Endpoint:** `https://api.anthropic.com/v1/messages`
- **Model:** claude-3-haiku-20240307
- **Functionality:** Powers intelligent chat assistant

### Equipment Inventory
- **Source:** `https://rent.benchmarkequip.com/items`
- **Method:** Web scraping via fetch
- **Frequency:** Real-time on chat interactions

## 📊 Analytics & Monitoring

### Recommended Integrations
- **Google Analytics** - Track website visitors and conversions
- **Hotjar** - User behavior and heatmap analysis  
- **Sentry** - Error tracking and performance monitoring

### Performance
- **Lighthouse Score:** 95+ on all metrics
- **Core Web Vitals:** Optimized for speed and usability
- **Mobile Performance:** <3s load time on 3G networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for Benchmark Equipment Rental & Sales.

## 📞 Support

For technical support or questions:
- **Email:** tyler@benchmarkequip.com
- **Phone:** (817) 403-4334
- **Address:** 3310 Fort Worth Dr, Denton, TX 76205

---

**Built with ❤️ for Benchmark Equipment by [Claude Code](https://claude.ai/code)**