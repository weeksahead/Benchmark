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

**Framework:** Next.js 15 (App Router), React 19, TypeScript
**Styling:** Tailwind CSS
**APIs:** Claude AI (Sonnet 4), Monday.com CRM
**Deployment:** Vercel

## 🚀 Quick Start

```bash
git clone https://github.com/weeksahead/Benchmark.git
cd Benchmark-Equipment
npm install
npm run dev
```

**Environment Variables:**
Create a `.env.local` file:
```env
CLAUDE_API_KEY=your_claude_api_key
MONDAY_API_TOKEN=your_monday_token
MONDAY_BOARD_ID=your_board_id
```

For production, add these in Vercel Dashboard → Settings → Environment Variables

## 📁 Project Structure

```
app/                    # Next.js app directory
  api/chat/            # Claude AI API route (server-side)
  api/contact/         # Monday.com API route (server-side)
  blog/                # Blog pages and posts
  layout.tsx           # Root layout with SEO
  page.tsx             # Homepage
components/            # React components (Hero, Contact, TylerAI, etc.)
data/                  # Blog posts and content
public/assets/         # Images and static files
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