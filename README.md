# Thales Serra Xavier — Professional Portfolio

React + Vite static portfolio with React Router, Lucide icons, centralized English/Brazilian Portuguese content, persistent theme/language, five case studies and local-only demonstrations. No backend, credentials, paid API or authentication is required.

## Local development

Requires Node.js 20.19+ or 22.12+ and npm. From this directory:

```sh
npm install
npm run dev
npm run build
npm run preview
```

Build output is `dist/`. Vite prints the local preview URL. The Google-hosted Manrope font is optional; system fonts provide a fallback when offline.

## Content and configuration

- `src/config.js`: email, optional authorized portrait, GitHub, LinkedIn, résumé PDF and original application demo URLs. Blank optional links are hidden. Daily Planner displays “Demo Coming Soon” until configured.
- `src/data.js`: bilingual project records, education, reported editable GPA, experience and skills. Preserve the distinction between supplied project claims and verified source inspection.
- `src/i18n.js`: all interface translations. `pt` maps to the `pt-BR` document language.
- `src/main.jsx`: React entry point. `src/App.jsx`: routing, layout, theme and language state.
- `src/components/`: shared controls, project cards and interactive demonstrations.
- `src/pages/pages.jsx`: content pages and case studies. `src/context.jsx`: shared translation context.
- `src/styles.css`: responsive layout, light/dark variables and reduced-motion support.

Place a real portrait in `public/images/profile/` and set `config.portrait` to `/images/profile/filename.jpg`. Do not use a fictional portrait. Project media belongs in `public/images/projects/`; replace the labeled case-study media placeholder with authorized images and descriptive bilingual alt text. The current visual project tiles are labeled placeholders, not screenshots.

For social media, place authorized files in `public/images/social-media/` and add entries to `galleryAssets` in `src/config.js`:

```js
{ id: 'real-flyer-1', type: 'flyer', src: '/images/social-media/real-flyer.jpg',
  title: { en: 'Actual work title', pt: 'Título do trabalho real' },
  alt: { en: 'Describe the real image', pt: 'Descreva a imagem real' } }
```

Supported types: `flyer`, `carousel`, `video`, `thumbnail`. A carousel uses `slides: ['/images/social-media/slide-1.jpg', '/images/social-media/slide-2.jpg']` and can omit `src`. Video uses a browser-playable MP4 URL in `src`. Real images open in a native accessible modal with focus containment, Escape dismissal and focus return; carousels have previous/next buttons. Videos have native controls. Empty categories show labeled placeholders. No client artwork was invented.

The customer-service demo uses the fictional company Nova Demo and synthetic information. It simulates triage, registration, notification and handoff using local state only. Assignment Hub uses fictional October 2026 deadlines, course filters, completion, list and monthly calendar views, and simulated sync/notifications. Demo changes reset on reload. Neither demonstration accesses real WhatsApp, databases, OpenAI, Moodle or Google Calendar. Original application links must point to separately deployed applications. Video clipping remains conceptual pending source verification.

## GitHub and Cloudflare Pages

1. The source repository is [thalesxavier1298/ThalesXavier-Lab](https://github.com/thalesxavier1298/ThalesXavier-Lab), branch `main`. The initial source upload has been confirmed.
2. Clone the repository and run `npm install` to develop on another computer. Commit and push future source changes. Never commit secrets, `node_modules` or generated `dist` files.
3. In Cloudflare, open Workers & Pages, create a Pages project and connect that GitHub repository.
4. Choose the Vite preset, build command `npm run build`, output `dist`, and this folder as the root if nested in a repository. Use a supported Node version (22 or 24).
5. Deploy. The generated Pages URL is the initial public address. No deployment has been performed by this local project.
6. Pages provides its default SPA fallback when no top-level `404.html` is present. Do not add the catch-all `/* /index.html 200` redirect: the Workers deployment rejects that rule as a loop. Verify `/about`, `/projects/assignment-hub` and an unknown path by direct visit and refresh on the actual host.
7. Add a custom domain later in the project's Custom domains section and follow Cloudflare's DNS instructions.
8. Update `config.siteUrl` when the final origin is known. The next production build automatically generates `dist/sitemap.xml` and its entry in `robots.txt` using that real origin. Until configured, sitemap generation is deferred to avoid inventing a domain. Add canonical/OG URL metadata once the actual public origin is chosen if desired.
9. Future edits pushed to the connected production branch trigger a new build. Add social/profile links and independent app URLs in configuration only when their real addresses are available.

## Existing Cloudflare Workers project

The dashboard deployment log showed the project `thalesxavier-lab` uses Workers Static Assets rather than Pages. This is supported by the checked-in `wrangler.jsonc`:

- Build command: `npm run build`.
- Deploy command: `npx wrangler deploy`.
- Root directory: repository root (leave blank or use `/` in the dashboard).
- Worker name: `thalesxavier-lab`, matching the existing project.
- Static asset directory: `./dist`.
- SPA fallback: `assets.not_found_handling: "single-page-application"`.

No Worker script, database or secrets are required. The unsupported catch-all `_redirects` file has been removed; preserve that removal in future builds. Deploy the corrected commit, rather than retrying the old failed commit. Cloudflare supplies the actual public URL after a successful deployment; no URL is assumed here. Actual hosted route checks remain pending until that URL is available.

## Routes

`/`, `/about`, `/education`, `/experience`, `/skills`, `/projects`, `/contact`, `/projects/customer-service-automation`, `/projects/social-media-content`, `/projects/daily-planner`, `/projects/assignment-hub`, `/projects/ai-video-clipping`; unknown routes render the portfolio's 404 view.

## Accessibility and verification

Semantic landmarks, skip link, active navigation, visible focus rings, native controls/dialogs, translated labels, touch targets, reduced motion and system theme detection are included. Production build and browser verification results are recorded in `QA.md`. The gallery's actual media playback and real integrations require supplied files/URLs and are not asserted as tested with nonexistent assets.

Before public launch, add the real photo and authorized media, confirm personal facts, configure live application/social URLs, and verify direct route refreshes on the actual hosting configuration. No private data, production workflow definitions or API keys belong in this static project.
