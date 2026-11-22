# CampusLoop

CampusLoop is a student-to-student marketplace for campus products. Its current implementation is a dependency-free Node.js HTTP server with a responsive HTML/CSS/JavaScript client and JSON-file persistence.

## Run locally

Requirements: Node.js 18 or newer.

1. Copy `.env.example` to `.env`.
2. Optionally set `PORT`, `ADMIN_EMAIL`, and `GEMINI_API_KEY` in `.env`.
3. Run `npm start` and open http://localhost:3000.

`npm run dev` starts Node's watch mode. No npm install is needed.

## Available features

- Product search, categories, condition/price filters, sorting, details, and seller listings.
- Clear Buy, Rent, Exchange, and Sell modes. Rental requests support date ranges up to 30 days, campus pickup, daily fees, refundable deposits, owner approval, an incoming-renter page, and notifications. Sample listings auto-approve in demo mode. No money is collected.
- Expanded semester inventory: books, lab records, drawing stationery, Arduino and Raspberry Pi boards, ESP32, sensors, motor drivers, robotics demos, multimeters, bench supplies, toolkits, soldering practice kits, audio gear, calculators, and black/blue/white/grey blazers.
- Seller listings can include the original price and show a one-click suggested 50% resale price. Sellers can adjust it to match condition and included parts.
- Starter products use local real-photo assets served by the backend, so cards do not depend on third-party image hosts; seller image URLs remain supported with local category-photo fallbacks. See [IMAGE_CREDITS.md](IMAGE_CREDITS.md) for photo sources and license attribution.
- Scrypt-hashed registration, login/logout, expiring bearer sessions, profile editing, and role-gated admin views.
- Listing create/edit/delete with seller ownership checks.
- Cart, wishlist, checkout payment preference (campus handoff or clearly labeled online demo), server-calculated order totals, and order history. No card data is collected.
- Wanted Board posts and student-to-student exchange requests with accept/decline.
- Loop AI recommendations from actual current listings, with a local fallback. Recommendations open the matching product details; common Arduino spelling variants are normalized.
- Demo checkout only. It does not collect payment or call a payment provider.

## Data and configuration

The server creates `data/db.json` on first run. This local file is convenient for development but is not a scalable production database. It is ignored by git. `ADMIN_EMAIL` grants the administrator role to a matching email when that account registers. The API key remains on the server and is never sent to the browser.

The current project does **not** use React, Vite, Tailwind, Express, MongoDB, or Mongoose. It also does not support direct image uploads; listings accept HTTPS image URLs. Those integrations require a separate migration and, for MongoDB and Gemini, external configuration. `.env.example` intentionally does not suggest that MongoDB is already connected.

Before public deployment, replace JSON persistence with a transactional database, add CSRF protection and production-grade session storage, configure HTTPS, and use managed image storage and moderation. The local demo uses bearer tokens in browser storage and is not production-hardened.
# campusloop-thrivel

## Deploy to Vercel

The project includes a Vercel serverless API adapter in `api/[...path].js`; `vercel.json` selects Vercel's **Other** preset (preventing Node framework auto-detection) and configures `public/` as the static output directory for the site and local product photos. The GitHub repository is `dharun-2411/campusloop-thrivel`.

1. Push the deployment adapter and `vercel.json` to the `main` branch, then import or redeploy `dharun-2411/campusloop-thrivel` from Vercel.
2. Select **Other** as the framework preset and keep the repository root as the project root. No build command is required; the output directory is configured in `vercel.json`.
3. Optionally add `ADMIN_EMAIL` and `GEMINI_API_KEY` under Project Settings → Environment Variables, then deploy.

The GitHub import route builds on Vercel's Linux workers. A local Windows CLI attempt here could not complete because Vercel's builder requires filesystem symlinks (`EPERM`), and this terminal is not authenticated to a Vercel account.

**Demo storage limitation:** Vercel uses `/tmp` for this app's JSON data, and that storage is temporary and isolated between serverless instances. The deployed demo can start, but accounts, listings, rentals, and orders are not durable. For a real public marketplace, connect a persistent database before relying on it; this repository currently has no MongoDB/production database adapter.
