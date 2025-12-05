# Push-Up Challenge

A mobile-first web application for tracking push-ups, competing on leaderboards, and achieving fitness goals.

## 🚀 Features

- ✅ Authentication with Supabase
- ✅ Real-time push-up tracking
- ✅ Interactive charts with Nivo
- ✅ Weekly leaderboards
- ✅ Profile management
- ✅ Dark mode support
- ✅ Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TailwindCSS
- **UI Components**: shadcn/ui, Nivo charts
- **Backend**: Supabase (Auth, Database, RLS)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 20+
- pnpm
- Supabase account

## 🏃 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sharopcha/pushups-challenge.git
cd pushups-challenge
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase

Run the migration in your Supabase SQL editor:

```bash
# The migration file is located at:
supabase/migrations/20251205000001_initial_schema.sql
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment

This project is configured to deploy to Vercel automatically via GitHub Actions.

### Manual Deployment

```bash
pnpm dlx vercel
```

## 📁 Project Structure

```
pushups-challenge/
├── app/                    # Next.js app directory
│   ├── (protected)/       # Protected routes
│   ├── auth/              # Authentication
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── charts/           # Nivo chart components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   └── chart-utils.ts    # Chart helpers
└── supabase/             # Database migrations
```

## 📝 License

MIT

## 👤 Author

sharopcha
