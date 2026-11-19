# Thales Xavier — Portfolio Concept

An independent design prototype for a premium redesign of Thales Xavier's portfolio. It does not touch, replace or deploy the existing site.

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion for React · Lucide · React Router

## Run it locally

Requires Node.js 20.19+ (22 recommended).

```bash
npm install
npm run dev        # development server, http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build, http://localhost:4173
npm run lint       # oxlint
node scripts/test-jarvis.mjs   # game tests (unchanged)
```

## Deploy (Cloudflare Workers)

Cloudflare runs `npm run build` and serves `dist/` using `wrangler.jsonc`. `not_found_handling: "single-page-application"` makes clean URLs such as `/about` and `/projects/assignment-hub` work on refresh and direct links.

- **Legacy URLs:** `/education` and `/experience` redirect to `/about`, while `/skills` and `/contact` open the home page at that section.
- **Game:** the Teófilo game lives in `public/jarvis/` and is served at `/jarvis/`, unchanged by the redesign.
- **Sitemap:** to generate one, build with `SITE_URL=https://thalesxavierwork.com npm run build`.
- **Single-file preview:** `VITE_ROUTER=memory npx vite build` uses in-memory routing and inlines every asset. It is only for the shareable preview, not for deployment.

## Structure

```
src/
  index.css                 design tokens (dark + light), type scale, utilities
  i18n/en.ts, pt.ts         all visible copy; pt.ts is type-checked against en.ts
  i18n/index.tsx            language context (EN default, remembered per browser)
  theme/ThemeProvider.tsx   theme context (dark default, remembered per browser)
  data/projects.ts          project registry (structure only, no copy)
  components/               Nav, Hero, ProjectCard, Sections (skills, process, contact, footer), ui primitives
  components/previews/      illustrative interface mockups per project
  demos/NovaDriveDemo.tsx   customer-service simulation (chat + live event monitor)
  demos/AssignmentHubDemo.tsx  fictional academic dashboard
  pages/                    Home, Work, CaseStudy, About, NotFound
```

## Design system

- **Color:** graphite `#0F1113`, surface `#15181B`, off-white `#ECECE8`, neutral grays, one "signal" blue accent (`#8A9BFF` dark / `#3245D1` light) used only for routes, live states and focus. Text tokens meet WCAG AA on their backgrounds in both themes.
- **Type:** Bricolage Grotesque (variable, condensed width for display) + IBM Plex Sans for reading. IBM Plex Mono appears only in the event log, where content is genuinely machine data. Fonts are self-hosted via Fontsource.
- **Signature:** the hero headline is literally connected by a route line with a node at each line of type. The same route language returns in the process section and the demo's event monitor.
- **Motion:** one orchestrated hero entrance, subtle section reveals, page transitions and pointer-follow light on project cards (fine pointers only). `MotionConfig reducedMotion="user"` plus a CSS fallback honor reduced-motion preferences; content never depends on animation to be visible or scrollable.

## Demos and data

Both demos run entirely in component state. No backend, no external API calls, no storage of personal data; restarting or leaving the page discards everything. The NovaDrive email is masked in the event log. Theme and language preferences are the only things saved (in localStorage, wrapped so the site still works when storage is blocked).

## Content source

All personal and project content now comes from the current production site's repository (`thalesxavier1298/ThalesXavier-Lab`, `src/data.js`, `src/i18n.js`, `src/config.js`), adapted to this design. Photos come from its `public/images/profile/` folder and live in `src/assets/`.

Still to confirm or supply:

1. **Video project** — this design keeps the brief's framing (a workflow using existing AI tools, not software Thales built) merged with the site's "Video Analysis & Clipping" concept. Tools listed: CapCut, ChatGPT.
2. **Teófilo game** — the Work page links to `https://thalesxavierwork.com/jarvis/` (`GAME_URL` in `src/lib/utils.ts`); confirm the path once this design replaces the current site.
3. **Media** — social-media gallery placeholders and app screenshots (Daily Planner, Assignment Hub).
4. **Links** — LinkedIn URL, résumé PDF, and Daily Planner public URL.
5. **Skills** — React was added from the redesign brief; the current site does not list it.

## Reference note

The three reference sites (allerstudio.com, lundanistudio.framer.website/about, rig.ai) could not be loaded from the build environment. The design follows the role the brief assigned to each reference rather than their specific visual details, and copies nothing from them.
