# Cloud Cost Explorer

A drill-down infrastructure cost dashboard built with Next.js, Framer Motion, and TanStack Query.

---

## Feature Choice: Why a Cost Explorer?

I chose to build a hierarchical cost explorer — clusters drilling into namespaces drilling into pods — rather than a flat data table or simple chart. A few reasons drove that decision.

Cost visibility is a real problem in cloud engineering. Teams frequently overspend because costs are aggregated at the account level, making it impossible to attribute spend to a specific workload or team. A drill-down interface where you can navigate from "Cluster A costs $82k/mo" down to "the `inference` namespace is responsible for 60% of that, and GPU underutilization is the cause" is something I would actually want to use.

The hierarchy also creates a natural interface problem worth solving. Transitions between levels need to communicate spatial navigation — you're going *deeper*, then coming back *up* — not just swapping data. That challenge made the feature more interesting to build.

---

## Animation Approach

My goal was for every animation to be *load-bearing*: it should either communicate state, guide attention, or provide physical feedback. If an animation serves only aesthetics, it tends to become noise.

**Spring physics over duration curves.** I used Framer Motion's spring model (`stiffness`, `damping`) rather than specifying explicit durations wherever possible. Springs feel physically grounded — elements decelerate naturally rather than stopping on a mathematical schedule. For the bar chart entrance, `stiffness: 300, damping: 22` gives bars a confident, settled feel without bounce. For hover responses, higher stiffness (`440`) makes the interaction feel instant.

**Stagger communicates structure.** When a new level loads, bars and table rows enter sequentially (55ms apart) rather than all at once. This isn't decoration — it helps the eye parse the data hierarchy as a list rather than as a simultaneous block drop. The stagger is capped at 8 items so it never makes the user wait on a long list.

**Exits are fast.** Entrance animations can afford to be expressive; exits should be quick. A panel leaving the screen isn't interesting — it's just in the way. Exit transitions are typically 100–150ms with `ease: "easeIn"` so they accelerate out of frame.

**Counting numbers communicate live data.** The savings banner animates its dollar amount using `useSpring` (stiffness 65, damping 16). When you drill into a new cluster, the number counts up from zero. This small detail makes the metric feel computed — not static — and draws attention to the value at exactly the moment you arrive.

**Reduced motion is a first-class constraint.** Every Framer Motion component calls `useReducedMotion()` and every CSS animation is zeroed in the `prefers-reduced-motion` media query. The dashboard is fully functional without any motion.

---

## Token and Style Architecture

Styles are split across two layers that serve different purposes.

**CSS custom properties in `globals.css`** are the source of truth for every color, radius, and spacing value. They're defined once on `:root`, overridden by `[data-theme="dark"]`, and auto-applied by the system dark-mode media query for first-paint. This means theme switching is instantaneous — no class toggling, no re-render, just a `data-theme` attribute flip on `<html>`.

**`lib/tokens.ts`** is a TypeScript mirror of those variables. It exposes the same values as a typed object (`tokens.colors.accentSuccess`, etc.) for use inside `style={{}}` props where Tailwind can't reach — animated `color-mix()` backgrounds, dynamic `filter` values, and similar. The two layers stay in sync manually, which is a tradeoff I'd address with more time (see below).

Tailwind handles layout, spacing, and typography. I avoided putting semantic color choices into Tailwind utility classes — those live in the token system — so the component markup stays readable and the color system stays centralized.

---

## Data Fetching and Caching

The dashboard fetches from the [DummyJSON](https://dummyjson.com) products API and transforms the response into a cost hierarchy. The transform layer (`lib/transform.ts`) maps product fields onto cost metrics: price becomes the base compute cost, ratings become efficiency scores, and product categories determine whether GPU spend is allocated.

This is deliberately fake data with real API mechanics, which lets me demonstrate caching behavior without requiring backend infrastructure.

**TanStack Query** manages the fetch lifecycle. The configuration in `providers/QueryProvider.tsx` sets:

- `staleTime: 5 minutes` — data is considered fresh for 5 minutes, so navigating away and back doesn't trigger a refetch
- `gcTime: 10 minutes` — the cache is kept in memory for 10 minutes after the last subscriber unmounts
- `retry: 2` — two retries on failure before giving up

If the API fails entirely, `useClusterData` falls back to a local `staticClusters` dataset so the dashboard remains functional. The component shows a subtle notice when it's running on static data.

The data is fetched client-side with no server component involvement. That's a deliberate simplification — see the tradeoffs section.

---

## Libraries

| Library | Why |
|---|---|
| **Next.js 15 (App Router)** | RSC architecture, file-based routing, built-in font optimization. I used the App Router for layout composition even though the data fetching is client-side. |
| **Framer Motion 12** | Spring physics, `AnimatePresence` for exit animations, gesture hooks (`whileHover`, `whileTap`), and `useSpring`/`useMotionValueEvent` for the counting animation. The API surface is large but the core motion primitives are well-thought-out. |
| **TanStack Query 5** | Declarative fetch state, automatic cache management, and deduplication. It handles the loading/error/success states that I'd otherwise be writing with `useEffect` + `useState`. |
| **Tailwind CSS 4** | The v4 CSS-first config (no `tailwind.config.js`) keeps the build simpler. Container queries (`@container`) let the chart respond to its own width rather than the viewport, which is more robust for a resizable panel. |

---

## Tradeoffs and Decisions

**Client-side data fetching.** The dashboard fetches entirely on the client. The better architecture for a real product would be a Server Component that pre-fetches data and streams it, eliminating the loading skeleton on first visit. I kept it client-side to demonstrate the TanStack Query caching behavior more clearly — with SSR, the cache interaction is less visible.

**Transform complexity.** The `transformProducts()` function packs a lot of domain logic: batching products into a 4×3×2 cluster hierarchy, cycling short arrays, aggregating metrics upward. This works, but it's fragile — if the API returns fewer than 24 products, the cycling logic kicks in silently. A real system would either validate the API contract or use a fixed mock that doesn't depend on cycling.

**Token duplication.** `globals.css` and `lib/tokens.ts` define the same values twice. If I add a new semantic color, I have to update both files. The right solution is to generate `tokens.ts` from the CSS variables at build time, or to use CSS-in-JS that reads custom properties directly. I kept it manual here to avoid adding a build step.

**Efficiency metric.** The efficiency score is derived from product ratings (`(rating / 5) * 65 + 5`), which produces a range of roughly 5–70%. Nothing ever reaches 100% efficient, which is actually realistic for cloud workloads, but the specific formula is arbitrary. A real cost explorer would pull utilization data from a metrics API (Prometheus, CloudWatch, etc.).

---

## What I Would Improve With More Time

**Real data source.** The most impactful change would be connecting to a real infrastructure metrics API. The transform layer is already isolated (`lib/transform.ts`), so swapping the data source is a contained change — but the schema would need to be redesigned around real concepts like node pools and resource requests/limits vs. actual usage.

**Number virtualization.** The table renders all rows in the DOM. At namespace or pod scale with hundreds of items, this would cause performance problems. A windowed list (TanStack Virtual) would fix this.

**Tokens sync.** Automate the `globals.css` → `tokens.ts` relationship. A small build script that parses the CSS variables and emits a typed TypeScript file would eliminate the manual duplication entirely.

**Charts.** The bar chart is custom-built with Framer Motion. For a production tool I'd either invest in making it fully accessible (the current SVG-less approach has limits for screen readers and tooltips) or integrate a charting library that handles those concerns. Recharts or Observable Plot would be good fits here.

**E2E tests.** The drill-down navigation and hover interactions are the core UX, and they're currently untested. Playwright tests covering the full cluster → namespace → pod flow and verifying that the correct data appears at each level would give real confidence before any refactor.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run format   # Prettier
npm run lint     # ESLint
npm run build    # Production build
```
