# Handcrafted Haven

A Next.js marketplace for handmade products, backed by MongoDB and Mongoose.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `MONGODB_URI` to a local MongoDB database or a MongoDB Atlas connection string.
4. Run `npm run db:seed` to load the starter marketplace data.
5. Run `npm run dev` and open `http://localhost:3000`.

## Database collections

- `users`: buyer, artisan, and admin accounts with hashed passwords
- `artisans`: public seller profiles and follower relationships
- `products`: catalog, inventory, pricing, publishing, and ratings
- `reviews`: one product review per user
- `orders`: immutable line-item snapshots, totals, shipping, and status
- `carts`: one active cart per user
- `newslettersubscribers`: newsletter opt-ins
- `contactmessages`: customer support inquiries

Models live in `src/models`, the cached connection helper is in `src/lib/mongodb.ts`, API routes are in `src/app/api`, and starter data is in `scripts/seed.ts`.

Authentication uses signed, HTTP-only cookies. Standard sessions last 24 hours; selecting “Remember me” extends the session to 14 days. Add email verification and password-reset delivery before accepting real orders.

Customers sign in at `/sign-in`; artisans sign in at `/artisan/sign-in`. Both pages reuse the same authentication service, while the server enforces the expected account role.

Roles are additive: customers can shop and manage a cart; artisans can do everything a customer can do plus access the seller dashboard and manage their own shop.
