# NextJS DuoTech Kit

## Quickstart 
1. Run `npm install`
2. Setup Authentication
2. Setup Prisma.
3. Setup Stripe.
4. Run `npm run dev`

## Setup Authentication

1. Set the `IRON_SESSION_PASSWORD` in `.env`.
2. Set the `SENDGRID_API_KEY` in `.env`.
3. Set the `SENDGRID_VERIFIED_SENDER` in `.env`

## Setup Prisma
1. Set the `DATABASE_URL` in the `.env` file to point to your existing database.
2. Run `npx prisma generate` to generate the Prisma Client. You can then start querying your database.
2. Run `npx prisma db push` to generate the Prisma Client. You can then start querying your database.

## Setup Stripe
1. Set the `STRIPE_SECRET_KEY` in the `.env` file to point to your test environment Stripe key.

## Kit Includes
* Material UI
* Material Icons
* Prisma
* Prisma DBML Generator [Visualize the schema.dbml](https://dbdiagram.io/d)
* Iron Session Authentication
  - Persistant Users
  - Magic Link Login
* SendGrid
* Stripe

___

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.