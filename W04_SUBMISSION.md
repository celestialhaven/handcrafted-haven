# W04 Team Project Checkpoint

## Submission Links

### 1. Project Repository

https://github.com/celestialhaven/handcrafted-haven

The repository contains the Handcrafted Haven Next.js marketplace, including
TypeScript source code, App Router routes, MongoDB models, API routes,
authentication, shopping-cart behavior, responsive CSS Modules, seed data, and
deployment configuration.

### 2. Project Board

https://github.com/users/celestialhaven/projects/2

The team continued using the project board to track marketplace, dashboard,
database, authentication, accessibility, testing, and deployment work. The
board was updated during the W04 review from 10 to 19 items in the Done column,
with nine new completed items covering the work added beyond the original plan.
The repository history provides additional evidence of continued implementation
since the previous checkpoint.

### 3. Live Application

https://handcrafted-haven-psi-khaki.vercel.app

The application is deployed through Vercel. Production requires the
`MONGODB_URI` and `AUTH_SECRET` environment variables, plus MongoDB Atlas
network access, because database-backed pages execute their queries at runtime.

## Team Meeting Summary

**Meeting date:** August 1, 2026  
**Project:** Handcrafted Haven  
**Meeting type:** W04 checkpoint, implementation review, and deployment review

### Participants

- Jones G. Mabala
- Armando Martin Fernandez Jara
- Monday Victor Eluwa

### Meeting Purpose

The team reviewed the state of the Handcrafted Haven marketplace after moving
from static interface prototypes to a database-backed application. We compared
the completed implementation with the project board, discussed features added
outside the original Kanban scope, tested customer and artisan permissions, and
reviewed the requirements for running the application locally and on Vercel.

### Work Reviewed During the Meeting

The team reviewed the following completed work:

- MongoDB Atlas integration using Mongoose and a cached database connection.
- MongoDB models for users, artisans, products, reviews, orders, carts,
  newsletter subscribers, and contact messages.
- Database validation, indexes, timestamps, references, and starter seed data.
- Separate customer and artisan sign-in routes using one reusable
  authentication component and one secure authentication service.
- Bcrypt password hashing and signed, HTTP-only session cookies.
- A 24-hour normal session and an optional 14-day remembered session.
- Server-enforced customer and artisan role checks.
- Additive artisan permissions: artisans can shop as customers and can also
  access seller management features.
- Immediate logout that expires the session and prevents further protected-page
  access.
- A MongoDB-backed shopping cart with add, increment, decrement, remove,
  inventory validation, totals, and shipping calculations.
- A live header cart badge that updates when cart contents change.
- MongoDB-backed home-page products, categories, product counts, and featured
  artisan data.
- MongoDB-backed product catalog, product filtering, price filtering, sorting,
  and category query parameters.
- MongoDB-backed individual product details, populated artisan information,
  reviews, inventory, and cart integration.
- Navigation product search using a debounced URL query and server-side MongoDB
  matching across names, categories, and descriptions.
- React Server Component streaming with independent Suspense boundaries and
  skeleton states for database-backed home and catalog sections.
- Production builds, TypeScript validation, ESLint validation, and Atlas read
  and write verification.

## Discussion Notes

### Challenges

1. **Production environment configuration.** The application built successfully
   on Vercel but a database-backed Server Component could fail at runtime when
   `MONGODB_URI`, `AUTH_SECRET`, or Atlas network access was not configured in
   the Vercel production environment. This showed that a successful build does
   not guarantee that runtime dependencies are available.

2. **Authentication and role boundaries.** The team needed to distinguish the
   customer and artisan login experiences without duplicating password and
   session logic. We also initially treated customer and artisan permissions as
   mutually exclusive before recognizing that an artisan may buy products from
   other artisans.

3. **Keeping data consistent across screens.** The original application used
   hard-coded products, artisan profiles, cart counts, and dashboard values.
   Moving these features to MongoDB required consistent slugs, document
   references, session-aware API routes, and shared serialization logic.

### Successes

1. **End-to-end database functionality.** The application now reads and writes
   actual Atlas records. Product creation, customer registration, authentication,
   catalog queries, product details, and cart operations are connected to the
   database rather than placeholder arrays.

2. **Reusable and secure authentication structure.** Customer and artisan
   portals reuse the same form and server endpoint while enforcing the expected
   role on the server. Correct and incorrect role combinations were tested, and
   protected routes cannot be bypassed by entering URLs manually.

3. **Responsive streamed experience.** The home page and catalog render useful
   page structure immediately while independent database sections stream in.
   Layout-matched skeletons reduce visual shifting and respect reduced-motion
   accessibility preferences.

4. **Quality checks remained green.** After the database and authentication
   changes, the application continued to pass ESLint, TypeScript checking, and
   the optimized Next.js production build.

### Insights

1. **Roles should represent capabilities.** A customer can shop, while an
   artisan can shop and manage a store. Modeling artisan permissions as an
   extension of customer capabilities better reflects a real marketplace.

2. **Client interaction and server authorization have different jobs.** Hiding
   a button improves the interface, but API routes and server layouts must still
   verify the session and role because interface restrictions alone are not
   security controls.

3. **Deployment configuration is part of the application.** Database URLs,
   signing secrets, Atlas access rules, and runtime logs must be reviewed along
   with source code. Secrets should remain outside Git and be configured through
   the deployment platform.

4. **Streaming improves perceived performance.** Splitting database work into
   independent Suspense boundaries prevents one slow query from blocking the
   complete page and gives users immediate visual feedback.

## Features Added Outside the Original Kanban Board

During implementation, the team identified and completed several improvements
that were not explicitly represented by the original board items:

- Separate customer and artisan login portals with a shared implementation.
- Additive role capabilities allowing artisans to shop and manage a store.
- Configurable session duration with a 14-day “Remember me” option.
- Immediate cookie invalidation and role-aware logout destinations.
- Live navigation cart count synchronized through application events.
- Free-shipping threshold and live order-summary calculations.
- Server-side inventory limits during cart add and quantity updates.
- Debounced global product search in the main navigation.
- Shareable product search and category URLs.
- Independent streaming and skeleton states for MongoDB queries.
- Reduced-motion support for skeleton animations.
- Runtime deployment review for Vercel environment variables and Atlas access.
- Safer form fallbacks that prevent credentials from appearing in query strings.
- API error handling for validation errors, duplicate records, authentication,
  authorization, and missing resources.

Nine consolidated items from this list were added to the project board’s Done
column so the board accurately represents the current product.

## Technical Verification Completed

The team used the following checks during implementation:

```text
npm run lint
npx tsc --noEmit
npm run build
npm run db:seed
```

Additional verification included:

- Confirming seeded MongoDB collection counts.
- Verifying bcrypt password hashes for the demo accounts.
- Testing valid customer and artisan logins.
- Testing rejection through the incorrect login portal.
- Testing normal and remembered cookie expiration periods.
- Testing logout followed by protected-route access.
- Testing cart add, quantity update, and removal against Atlas.
- Testing customer and artisan route permissions.
- Verifying the exact home-page products, categories, and artisans returned by
  Atlas.

## Demo Accounts

### Customer

```text
Sign-in page: /sign-in
Email: emma.brooks@example.com
Password: Handmade123!
```

### Artisan

```text
Sign-in page: /artisan/sign-in
Email: maya-chen@example.com
Password: Handmade123!
```

These credentials are for demonstration only and should be replaced or removed
before a production launch.

## Decisions and Action Items

### Decisions

- Continue using one authentication service with separate customer and artisan
  entry points.
- Treat artisan permissions as customer permissions plus seller capabilities.
- Keep secrets out of Git and configure them through `.env.local` and Vercel.
- Use MongoDB as the source of truth instead of maintaining duplicate hard-coded
  catalog data.
- Continue using streamed server components for database-heavy screens.

### Remaining Action Items

- Configure and verify `MONGODB_URI` and `AUTH_SECRET` for every Vercel
  environment.
- Rotate the Atlas database password and use a least-privilege database user.
- Add production login rate limiting and security audit logging.
- Add email verification and password-reset email delivery.
- Add durable product image storage and optimized product imagery.
- Complete checkout, payment processing, order creation, and inventory updates.
- Replace remaining dashboard placeholder metrics with MongoDB aggregations.
- Add automated integration and end-to-end tests.

## Rubric Compliance Checklist

- [x] Repository URL is included and points to the Next.js project.
- [x] Project-board URL is included.
- [x] Continued work since the previous report is documented.
- [x] Meeting participants are listed.
- [x] More than one challenge is documented.
- [x] More than one success is documented.
- [x] More than one insight is documented.
- [x] Features completed outside the original Kanban board are documented.
- [x] Decisions, validation evidence, and remaining action items are included.
