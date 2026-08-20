# House of Aura 👔👗

Full-stack clothing e-commerce platform for a Pakistani fashion brand. Built with Next.js 15 (App Router), TypeScript, and Prisma/PostgreSQL, with real authentication, order persistence, and an AI-powered stylist chatbot.

## Features

- **Storefront** — browse by category (women/men eastern & western, kids, accessories, perfumes, jewellery), product detail pages, image carousels
- **AI Stylist Chatbot** — a conversational assistant (powered by Groq/Llama 3.3 70B with function calling) that asks about gender, occasion, and style, then recommends real products from the catalog
- **Auth** — email/password signup & login with hashed passwords (bcrypt) and JWT session cookies (jose)
- **Cart & Favorites** — client-side, persisted to `localStorage` (no login required to browse or add to cart)
- **Checkout & Orders** — checkout and order history are real backend features: protected by auth, orders are written to and read from a PostgreSQL database via Prisma
- **Route protection** — `/checkout` and `/account/orders` require a logged-in session (enforced in `middleware.ts`, redirects to `/auth` otherwise)

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Prisma](https://www.prisma.io/) + PostgreSQL — users, orders, order items
- [jose](https://github.com/panva/jose) — JWT session tokens (httpOnly cookie)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — password hashing
- [Groq API](https://groq.com/) (Llama 3.3 70B) — AI stylist chatbot with tool/function calling
- Tailwind CSS v4 + Radix UI + shadcn-style components
- Zustand (favorites), React Context (cart)
- React Hook Form + Zod for form validation

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # signup, login, logout, me — session/JWT-based
│   │   ├── chat/           # POST — AI stylist chatbot (Groq + product recommender)
│   │   └── orders/         # GET/POST — protected, reads/writes Prisma Order records
│   ├── auth/               # login/signup page
│   ├── cart/                 # cart page (client-side)
│   ├── checkout/             # checkout page (protected route)
│   ├── account/orders/        # order history page (protected route)
│   ├── shop/[category]/       # category listing
│   ├── product/[id]/          # product detail
│   ├── favorites/
│   └── page.tsx              # homepage
├── components/                # UI components
├── lib/
│   ├── auth.ts               # password hashing + JWT session helpers
│   ├── db.ts                 # Prisma client singleton
│   ├── products.ts            # static product catalog + categories
│   ├── stylist-engine.tsx      # maps chatbot intent → catalog recommendation
│   ├── cart-store.tsx          # cart context (localStorage-persisted)
│   ├── favorites-store.tsx      # favorites store (Zustand + persist)
│   └── orders-store.ts
└── middleware.ts              # protects /checkout and /account/orders

prisma/
├── schema.prisma              # User, Order, OrderItem models (PostgreSQL)
└── migrations/
```

## Environment Variables

Create a `.env.local` in the project root (no `.env.example` is included in the repo):

| Variable         | Required | Purpose                                                        |
|------------------|----------|------------------------------------------------------------------|
| `DATABASE_URL`   | Yes      | PostgreSQL connection string, used by Prisma                    |
| `JWT_SECRET`     | Recommended | Signs session JWTs. Falls back to an insecure dev default if unset — **must** be set in production |
| `GROQ_API_KEY`   | Yes, for the chatbot | Groq API key; without it `/api/chat` returns an error   |



## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database

### Installation

```bash
npm install
```

### Set up the database

```bash
npx prisma migrate deploy   # applies the existing migration
npx prisma generate
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```


> **NOTE:** Storefront, cart, and favorites are frontend-only (localStorage). Auth and orders are real, backed by a PostgreSQL database via Prisma. The AI stylist chatbot makes real calls to the Groq API.
