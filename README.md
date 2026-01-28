# ❄️ SnowBuster

**On-demand snow removal at your fingertips.**

A two-sided marketplace connecting homeowners who need snow cleared with local "Snow Busters" ready to help. Built for NYC snow days.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Customer Portal** | Request snow clearing with upfront pricing |
| 📍 **Real-time Tracking** | Watch your job status update live |
| 💪 **Worker Dashboard** | Accept jobs, complete work, track earnings |
| 📊 **Admin Dashboard** | Platform stats, revenue, job management |
| 🤖 **AI Insights** | Weather-based timing recommendations |
| ⛄ **Fun Login** | Snowball explosion animation on sign-in |

---

## 🎨 Design

**"Fresh Morning Snow"** - A clean, light theme perfect for a friendly service app:

- **Background:** Crisp white/frost
- **Accent:** Winter sky blue (#3b82f6)
- **Typography:** DM Sans
- **Vibe:** Trustworthy, approachable, professional

---

## 📁 Project Structure

```
app/
├── page.tsx              # Landing page
├── login/page.tsx        # Login with snowball animation
├── customer/
│   ├── page.tsx          # Service request form
│   └── track/[id]/       # Job tracking
├── worker/page.tsx       # Worker dashboard
├── admin/page.tsx        # Admin dashboard
├── layout.tsx            # Root layout + snowfall
└── globals.css           # Design system
lib/
└── store.ts              # Types, pricing, localStorage CRUD
```

---

## 💰 Pricing

| Service | Price |
|---------|-------|
| Driveway Clearing | $45 |
| Walkway Clearing | $25 |
| Car Dig-Out | $35 |
| Full Package | $85 |

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Pure CSS with variables
- **State:** localStorage + storage events for cross-tab sync
- **Animations:** CSS keyframes

---

## 📄 License

MIT