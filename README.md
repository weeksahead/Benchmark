# Benchmark Equipment Rental & Sales

Modern construction equipment rental website with AI-powered chat support and CRM integration.

**🔗 Live Site:** [benchmarkequip.com](https://benchmarkequip.com)

## ✨ Key Features

- **Tyler AI Chat** - Claude-powered assistant with real-time equipment inventory
- **Admin Dashboard** - GitHub-integrated CMS for managing content and photos  
- **Monday.com CRM** - Automated lead capture and customer management
- **Mobile-First Design** - Responsive layout optimized for all devices
- **SEO Optimized** - Meta tags, structured data, social media previews

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS  
**Backend:** Vercel Serverless Functions  
**APIs:** Claude AI, Monday.com CRM, GitHub (CMS)  
**Deployment:** Vercel

## 🚀 Quick Start

```bash
git clone https://github.com/weeksahead/Benchmark.git
cd Benchmark-Equipment
npm install
npm run dev
```

**Environment Variables:**
```env
VITE_MONDAY_API_TOKEN=your_token
VITE_MONDAY_BOARD_ID=your_board_id
VITE_CLAUDE_API_KEY=your_key
GITHUB_TOKEN=your_token
```

## 📁 Project Structure

```
src/components/          # React components (Hero, Contact, TylerAI, Admin)
src/config/             # Configuration files (slides, photos, Monday.com)
api/                    # Serverless functions (chat, contact, admin)
public/assets/          # Images and static files
```

## 🔧 Admin Dashboard

Access at `/admin` with GitHub authentication:
- **Hero Slider Management** - Add/edit carousel slides
- **Photo Gallery** - Upload and manage equipment photos  
- **Blog Posts** - Create and edit blog content
- **Live Updates** - Changes push directly to production via GitHub API

## 🤖 Tyler AI Features

- **Equipment Expertise** - Answers questions about construction equipment
- **Real-time Inventory** - Syncs with live rental availability
- **Lead Qualification** - Captures customer requirements
- **Mobile Optimized** - Full-screen chat experience

## 📞 Contact

**Benchmark Equipment Rental & Sales**  
📍 3310 Fort Worth Dr, Denton, TX 76205  
📞 (817) 403-4334  
📧 tyler@benchmarkequip.com

---
*Built with [Claude Code](https://claude.ai/code)*