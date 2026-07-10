# BurnLedger Architecture

BurnLedger is a full-stack SaaS-style subscription burn-rate monitor built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Core Flow

1. The dashboard loads in the browser.
2. The frontend requests subscription data from `/api/subscriptions`.
3. The API route uses Prisma Client to query PostgreSQL.
4. The dashboard calculates monthly burn, annual spend, renewal data, and category spend.
5. When the user adds a subscription, the frontend sends a POST request to `/api/subscriptions`.
6. The API validates the input and writes the subscription to PostgreSQL.
7. Refreshing the page reloads persisted data from the database.

## Main Technologies

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Prisma ORM
- PostgreSQL
- GitHub

## Data Model

The current schema includes:

- User
- Subscription

A user can own many subscriptions. Each subscription stores name, category, amount, currency, billing cycle, renewal date, status, and optional metadata.

## Current Limitations

- Authentication is not implemented yet.
- The app currently uses a demo user.
- Edit and delete subscription actions are planned.
- Deployment environment variables still need to be configured.

## Roadmap

- Add authentication
- Add edit/delete subscription actions
- Add budget limits
- Add renewal reminders
- Add spending insights
- Add tests
- Deploy to Vercel
