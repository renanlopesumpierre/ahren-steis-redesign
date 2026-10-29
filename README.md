# Ahren Steis — website redesign

Source code for the redesign previewed at https://ahren-steis.vercel.app/

It is a static site built with [Astro](https://astro.build). No database and no CMS: every page, text and image lives in this repository, so it can be hosted almost anywhere (Vercel, Netlify, Cloudflare Pages) for free.

## Run it on your computer

Requires [Node.js](https://nodejs.org) 22.12 or newer.

```bash
npm ci
npm run dev
```

Then open http://127.0.0.1:4841/

To build the final site: `npm run build`. The result goes to `dist/`.

## Where things are

| What you want to change | Where |
| --- | --- |
| Case studies, credits, services, image selection | `src/data/projects.ts` |
| Field Notes articles | `src/data/notes.json` |
| Pages (home, about, services, contact, work, insights) | `src/pages/` |
| Reusable blocks (hero, gallery, film player, cards) | `src/components/` |
| Colors, type and spacing | `src/styles/` |
| Smooth scroll, menu and motion | `src/scripts/` |
| Photos (originals; the build creates optimized WebP versions) | `src/assets/` |
| Logo, symbol and favicon | `public/brand/` |

## Before going live on ahrensteis.com

1. **Let search engines in.** The preview is hidden from Google on purpose. Remove `<meta name="robots" content="noindex,nofollow" />` from `src/layouts/Site.astro`, change `Disallow: /` to `Allow: /` in `public/robots.txt`, and delete the `missing preview noindex` check in `scripts/verify.mjs`.
2. **Deploy.** On Vercel: "Add New Project", import this repository, keep the defaults (build command `npm run build`, output `dist`). Then point the domain to it.
3. **Contact form (optional).** By default the contact page links to your existing Start Here form. To receive inquiries by email through the built-in form instead, create a free [Resend](https://resend.com) account and set these environment variables in the hosting dashboard:

   ```
   PUBLIC_CONTACT_FORM_ENABLED=true
   RESEND_API_KEY=...
   INQUIRY_TO=you@yourdomain.com
   INQUIRY_FROM=website@yourdomain.com
   SITE_ORIGIN=https://www.ahrensteis.com
   ```

The old URLs (`/start-here`, and the three article links) already redirect to their new pages.

## Checks

```bash
npm run build    # type check + build
npm run verify   # one h1 per page, image alt text, etc.
npm test         # contact form validation
```

## Credits

Photography, films and writing are Ahren Steis's own work, taken from ahrensteis.com. Fonts: Archivo and Inter (open source, SIL Open Font License).

The code is yours to use, change and deploy however you like.
