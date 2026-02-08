# Agent instructions: gtag (Google Analytics 4) integration

**Goal:** Ensure every project has Google Analytics 4 (gtag.js) integrated by default. Use these instructions when continuing work on a project or when adding gtag to an existing app.

## 1. Check if gtag is already set up

- **Plugin:** Look for a client plugin that loads gtag (e.g. `app/plugins/gtag.client.ts` or `plugins/gtag.client.ts`). It should read a measurement ID from runtime config and load `https://www.googletagmanager.com/gtag/js?id=<ID>`.
- **Config:** In `nuxt.config.ts`, `runtimeConfig.public` should expose a `gaMeasurementId` (or similar) from `process.env.GA_MEASUREMENT_ID`.
- **Value:** `GA_MEASUREMENT_ID` must be set (Doppler or env). Format: `G-XXXXXXXXXX`. If it’s empty, gtag won’t run.

If all three are present and `GA_MEASUREMENT_ID` is set, gtag is already integrated; no code changes needed.

## 2. If this repo is from nuxt-v4-template

- **New apps:** Running `npm run setup:new-app -- <APP_NAME> <SITE_URL>` (or `setup:all`) creates a GA4 property and stream and writes `GA_MEASUREMENT_ID` to the app’s Doppler project. The template already includes `app/plugins/gtag.client.ts` and `nuxt.config.public.gaMeasurementId`.
- **Existing app missing the ID:** Run analytics setup so the ID gets created and stored:  
  `SITE_URL="<app URL>" doppler run --project nuxt_template --config base -- npm run setup:all`  
  (or `setup:ga` if only GA4 is needed). Then ensure the app’s Doppler or env has `GA_MEASUREMENT_ID` for build/runtime.

No extra “gtag integration” script is required; the plugin is in the template and is active when `GA_MEASUREMENT_ID` is set.

## 3. If this repo does not have the gtag plugin

Add gtag by default:

1. **Runtime config** (in `nuxt.config.ts` under `runtimeConfig.public`):
   ```ts
   gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
   ```

2. **Client plugin** (e.g. `app/plugins/gtag.client.ts` or `plugins/gtag.client.ts`):
   - Read `useRuntimeConfig().public.gaMeasurementId`.
   - If missing or on localhost, return early.
   - Define `window.dataLayer` and `gtag`, then call `gtag('js', new Date())` and `gtag('config', measurementId, { send_page_view: false })`.
   - Inject a script: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`.
   - Use the router to send `page_view` events on navigation (e.g. `router.afterEach` → `gtag('event', 'page_view', { page_path, page_title, page_location })`).
   - Add a `declare global` for `Window` with `dataLayer: any[]` if using TypeScript.

3. **Getting the measurement ID:** Either run the template’s `setup:all` / `setup:ga` (which creates a GA4 property and writes `GA_MEASUREMENT_ID` to Doppler), or create a GA4 property and web stream in the Google Analytics UI and set `GA_MEASUREMENT_ID` in the project’s env/Doppler.

## 4. Summary for the agent

- **Template-based app:** gtag is already integrated; ensure `GA_MEASUREMENT_ID` is set (via setup:all / Doppler). No new scripts needed.
- **Other app:** Add `gaMeasurementId` to runtime config, add the gtag client plugin (config + script + SPA page_view), and set `GA_MEASUREMENT_ID` (via setup or manually). Prefer using the template’s plugin and setup flow when possible.
