# ZARIYA by IQRA — Luxury Kashmiri Fashion eCommerce

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- MySQL (for Hostinger) or SQLite (for local dev)

### Steps
```bash
# 1. Install dependencies
bun install

# 2. Copy env file and fill in values
cp .env.example .env
# Edit .env with your database, Razorpay, Google OAuth credentials

# 3. Generate Prisma client
bun run db:generate

# 4. Push database schema
bun run db:push

# 5. Seed database with products, categories, admin user
bun run scripts/seed.ts
bun run scripts/seed-hero.ts

# 6. Run development server
bun run dev

# 7. Build for production
bun run build

# 8. Start production server
bun run start
```

## 🔐 Admin Login
- URL: `/admin/login`
- Email: `admin@zariya.com`
- Password: `zariya123`
- **Change password after first login!**

## 🌐 Hostinger Premium Deployment

### Step 1: Prepare Database
1. Login to Hostinger hPanel
2. Go to Databases → MySQL Databases
3. Create new database: `zariya_db`
4. Create user and grant all privileges
5. Update `.env`: `DATABASE_URL="mysql://USER:PASS@localhost:3306/zariya_db"`

### Step 2: Update Prisma for MySQL
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
Then run: `bun run db:push && bun run scripts/seed.ts && bun run scripts/seed-hero.ts`

### Step 3: Build & Deploy
```bash
bun run build
# Upload .next/standalone + .next/static + public + .env to Hostinger
# Use Node.js app in Hostinger or PM2
```

### Step 4: Configure Domain
- Point domain to the app
- Update `NEXTAUTH_URL` in `.env`
- Set up SSL (free Let's Encrypt in Hostinger)

## 📁 Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── store/             # Store page
│   ├── admin/             # Admin panel + login + instagram
│   ├── customer/          # Customer dashboard
│   ├── story/             # Brand story page
│   ├── journal/           # Blog
│   ├── track/             # Order tracking
│   ├── gift-card/         # Gift card balance
│   └── api/               # All API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   └── zariya/            # Custom ZARIYA components
├── data/                  # Catalog data (products, categories)
├── lib/                   # Utils, DB, auth
├── store/                 # Zustand stores
└── prisma/                # Database schema
```

## 🛠 Tech Stack
- Next.js 16 (App Router, standalone output)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM (SQLite/MySQL)
- Framer Motion (animations)
- Zustand (state management)
- NextAuth (Google OAuth)
- Razorpay (payments)

## 📞 Support
- WhatsApp: +91 98765 43210
- Email: zariyabyiqra@gmail.com
