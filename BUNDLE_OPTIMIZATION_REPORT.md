# Cloudflare Worker bundle optimization report

Date: 2026-07-18

## Outcome

The application now has a complete OpenNext/Cloudflare configuration and builds successfully with Next.js and OpenNext. Cloudflare's first authoritative Linux upload measurement was **15,002.33 KiB raw / 3,399.54 KiB gzip**. After removing duplicated Zod video chunks, Swiper, and Framer Motion, Cloudflare measured **13,808.55 KiB raw / 3,176.32 KiB gzip**: a verified reduction of **223.22 KiB gzip**, leaving 104.32 KiB to remove.

The latest pass removes the application middleware bundle while preserving authentication in the admin server layout and every admin API handler. The generated middleware manifest is empty, and the placeholder OpenNext middleware handler fell from Cloudflare's previous **486.90 KiB** module to **125.26 KiB raw** locally. A Cloudflare rebuild is required for the authoritative final compressed-upload measurement.

OpenNext 1.20.1 generates malformed Prisma WASM import paths when Wrangler runs on native Windows (a backslash before `node_modules` is interpreted as a newline), so Cloudflare's Linux build remains the source of truth for final compressed size.

## Size before and after

| Artifact | Before | After |
| --- | ---: | ---: |
| OpenNext server handler | 2.40 MiB raw | 2.40 MiB raw / 0.50 MiB gzip |
| Prisma runtime engines | More than 35 MiB raw (native engine plus MySQL, PostgreSQL, and SQLite WASM runtimes) | 4.00 MiB raw / 1.56 MiB gzip (two binary-free client WASM modules) |
| Cloudflare upload | 3,399.54 KiB gzip | 3,176.32 KiB gzip verified after pass two; final middleware-free measurement pending redeploy |
| Middleware handler | 486.90 KiB raw | 125.26 KiB raw placeholder with an empty middleware manifest |

The original project did not have the required `open-next.config.ts` or `wrangler.jsonc`, so no valid pre-optimization Wrangler compressed-upload number existed. The “before” value is the captured OpenNext handler plus traced Prisma engine files from the first successful OpenNext build, not an estimated Wrangler upload.

## Removed packages

- `@formspree/react` — no imports.
- `cloudinary` — no SDK imports; the existing lightweight HTTP implementation remains.
- `nextjs-toploader` — no imports.
- `openai` — no SDK imports; the existing lightweight chat HTTP implementation remains.
- `recharts` — no imports.
- `swiper` — replaced with a native scroll-snap carousel retaining autoplay and navigation.
- `framer-motion` — replaced with CSS animations and transitions at all five call sites.

The following build-only packages were moved from production dependencies to dev dependencies: `prisma`, `sharp`, and `@types/nodemailer`.

`@prisma/adapter-neon` was added to retain the same Prisma query API while using a Cloudflare-compatible, binary-free runtime. Prisma packages were aligned on 6.16.3, the Prisma 6 release line where the Rust-free client is generally available.

## Code and configuration changes

- Added standard OpenNext and Wrangler configuration, Worker build/preview/deploy scripts, and ignored generated `.open-next` artifacts.
- Kept Prisma out of all browser graphs by retaining `server-only` and converting client-callable database services into Server Actions.
- Configured OpenNext-recommended Prisma externals and enabled package import optimization for `react-icons`.
- Replaced Prisma's native query engine with `engineType = "client"` and the Neon driver adapter.
- Removed duplicate/deprecated `images.domains` configuration.
- Dynamically imported product reviews with `next/dynamic`; the chatbot and product-card paths are also already dynamically imported.
- Removed unused imports, state, helpers, a dead homepage database query, and unreachable chatbot cart code.
- Replaced Swiper and Framer Motion with native CSS/scroll behavior and removed Zod from the shared video client graph.
- Removed the standalone Next.js middleware graph. Admin pages remain protected by the server layout, unauthenticated client navigation is redirected by a minimal client boundary, and admin APIs retain their existing `requireAdmin` checks.
- No public route, API route, image, or feature component was removed because none could be proven unused without changing the app's externally reachable behavior.

## Largest remaining Worker inputs

| Input | Generated size |
| --- | ---: |
| Next.js server runtime | 2.57 MiB |
| Prisma query engine WASM | 2.15 MiB raw / 0.85 MiB gzip |
| Prisma query compiler WASM | 1.86 MiB raw / 0.72 MiB gzip |
| Application server code | 0.30 MiB |
| React DOM server code | 0.07 MiB |

## Verification

- Fresh production TypeScript validation passes. A pre-build `tsc` can reference stale generated route files after moving a route; the production build regenerates them.
- `npm run build` passes, including TypeScript, page-data collection, and all 61 static-generation entries.
- `npm run build:worker` completes and generates `.open-next/worker.js`.
- All existing application and API routes remain in the final route manifest.
- The generated middleware manifest contains no middleware or middleware functions.

## Additional recommendations

1. Rebuild in Cloudflare CI to capture the final compressed size. Native Windows is not fully supported by OpenNext and currently corrupts the generated Prisma WASM import paths during Wrangler's dry-run rebundle.
2. If Wrangler reports more than 3 MiB gzip in Linux, upgrade from Prisma 6 to Prisma 7's `prisma-client` generator with `runtime = "cloudflare"`; test this as a separate migration because it is a major-version change.
3. If more headroom is required, split admin and storefront route groups into separate Workers. This is an architectural deployment change and was not applied because it changes deployment topology.
4. Replace broad icon packages only if a Linux bundle analysis shows they enter server output. Current server metadata shows Next.js and Prisma dominate; UI libraries are emitted primarily as static client assets and do not materially affect the Worker limit.
