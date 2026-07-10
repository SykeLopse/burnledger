# BurnLedger

BurnLedger is a personal SaaS and subscription burn-rate monitor. It helps users understand how much they spend on recurring subscriptions, what renews soon, and where they may be able to reduce costs.

## What It Does

BurnLedger tracks subscriptions and shows:

- Monthly recurring spend
- Annualized subscription cost
- Upcoming renewals
- Spending by category
- Burn-rate trend charts
- Searchable subscription list
- Add-subscription workflow
- Persistent PostgreSQL-backed data

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Prisma ORM
- PostgreSQL
- GitHub

## Current Status

The app currently includes a polished dashboard, database schema, PostgreSQL persistence, seed data, and API routes for reading and creating subscriptions.

Authentication, edit/delete actions, tests, and production deployment are planned next.

## Local Development

Clone the repository:

    git clone https://github.com/SykeLopse/burnledger.git
    cd burnledger

Install dependencies:

    npm install

Create an environment file:

    cp .env.example .env

Add your PostgreSQL connection string to `.env`:

    DATABASE_URL="your_database_url_here"

Run Prisma migrations:

    npx prisma migrate dev

Seed the database:

    npx prisma db seed

Start the development server:

    npm run dev

Open:

    http://127.0.0.1:3000

## Project Structure

    src/
      app/
        api/subscriptions/
        page.tsx
      lib/
        prisma.ts
    prisma/
      schema.prisma
      seed.ts
      migrations/
    docs/
      architecture.md

## Portfolio Notes

This project demonstrates:

- Full-stack application development
- Database modeling with Prisma
- API route design
- Dashboard UI implementation
- Real persistence using PostgreSQL
- Clean Git and GitHub workflow
- Modern TypeScript-based web development

## License

MIT
