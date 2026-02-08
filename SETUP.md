# New app setup (from nuxt-v4-template)

Use this when you create a **new app** from this template.

## Get the template

Checkout the template with the GitHub CLI (requires **gh** installed and authenticated):

```bash
gh repo clone loganrenz/nuxt-v4-template <APP_NAME>
cd <APP_NAME>
```

Replace `<APP_NAME>` with your app slug (e.g. `my-app`). If the repo lives under a different org/user, use that instead of `loganrenz`.

## Prerequisites

- **Node.js** 20+
- **GitHub CLI (gh)** installed and logged in (`gh auth status`)
- **Doppler CLI** installed and logged in (`doppler login`)
- **nuxt_template** Doppler project has these secrets (config `base`):
  - `GA_ACCOUNT_ID`
  - `POSTHOG_PERSONAL_API_KEY`
  - `POSTHOG_HOST`
  - **`POSTHOG_PUBLIC_KEY`** – Use one shared PostHog project for all apps (avoids project limit). Create a single project in PostHog (e.g. "nuxt-template"), copy its project API key into nuxt_template. New apps get this key copied automatically; events are partitioned by `APP_NAME` (filter by property **app** in PostHog).
  - `GSC_SERVICE_ACCOUNT_JSON` (base64 of Google service account JSON; run `node scripts/doppler-b64-key.mjs ./path/to/key.json`)
  - `GSC_USER_EMAIL`
- **Cloudflare** account (Wrangler authenticated)

## Variables you need

| Variable     | Example                         | Description |
|-------------|----------------------------------|-------------|
| **APP_NAME** | `my-app`                        | Slug for the app (package name, Doppler project, Pages project, D1 DB name). Use lowercase, hyphens only. |
| **SITE_URL** | `https://my-app.pages.dev`      | Full public URL of the app. **Use the exact URL Cloudflare gives you**—if Pages assigns a suffixed URL (e.g. `my-app-47d.pages.dev`), use that everywhere. |

## One-command setup (recommended)

From the **new app directory** (after `gh repo clone ...` and `cd <APP_NAME>`):

```bash
npm run setup:new-app -- <APP_NAME> <SITE_URL>
```

Or directly:

```bash
node scripts/setup-new-app.mjs <APP_NAME> <SITE_URL>
```

Example:

```bash
npm run setup:new-app -- my-app https://my-app.pages.dev
```

The script will:

1. Update `package.json` name, `nuxt.config.ts` (site URL/name, appUrl), `wrangler.json` (name, D1).
2. Create a D1 database and wire it in `wrangler.json`.
3. Update `doppler.yaml` to the new app’s Doppler project/config.
4. Create the Doppler project and config (`dev_base`), set `SITE_URL`.
5. Create the Cloudflare Pages project.
6. Run `npm install`.
7. Run analytics setup (`setup:all`) using **nuxt_template** + your `SITE_URL` (writes `GA_MEASUREMENT_ID` into your app’s Doppler).

## After the script: deploy and GSC verify (required)

Setup is not complete until you run these two commands from the app directory:

1. **Deploy** (use your app’s Doppler so build gets `SITE_URL` and `GA_MEASUREMENT_ID`):

   ```bash
   doppler run -- npm run deploy
   ```

2. **Verify Google Search Console** (use nuxt_template for GSC credentials; quote SITE_URL):

   ```bash
   SITE_URL="https://my-app.pages.dev" doppler run --project nuxt_template --config base -- npm run setup:gsc:verify
   ```

Replace `https://my-app.pages.dev` with your actual SITE_URL (the same value you passed to the setup script).

**If GSC verify fails** with *"The necessary verification token could not be found on your site"*: (1) The production URL may not be serving yet—wait 1–2 minutes or run deploy again, then retry. (2) **If Cloudflare gave you a suffixed URL** (e.g. `my-app-47d.pages.dev` instead of `my-app.pages.dev`), GSC must use that same URL. Re-register and verify with it: run `SITE_URL="https://<your-real-url>.pages.dev" doppler run --project nuxt_template --config base -- npm run setup:gsc` (registers the real URL and creates the verification file), then deploy, then run `setup:gsc:verify` with the same `SITE_URL`.

## Optional: run steps manually

If you prefer not to use the script, follow the checklist in `scripts/doppler-env-keys.txt` and:

1. Set **APP_NAME** and **SITE_URL**.
2. Edit `package.json` (name), `nuxt.config.ts` (site.url, site.name, runtimeConfig.public.appUrl), `wrangler.json` (name, D1).
3. Create D1: `npx wrangler d1 create <APP_NAME>-db` and put the returned `database_id` (and name) into `wrangler.json`.
4. Edit `doppler.yaml`: `project: <APP_NAME>`, `config: dev_base`.
5. Create Doppler project and config, set SITE_URL (see doppler-env-keys.txt).
6. Create Pages project: `npx wrangler pages project create <APP_NAME> --production-branch main`.
7. Run `npm install`.
8. Run `SITE_URL=<SITE_URL> doppler run --project nuxt_template --config base -- npm run setup:all`.
9. Deploy and run `setup:gsc:verify` as above.

## Day-to-day commands

- **Dev:** `doppler run -- npm run dev`
- **Deploy:** `doppler run -- npm run deploy`
- **Analytics status:** `doppler run -- npm run setup:status`

Secrets live in Doppler only (no `.env`). See `scripts/doppler-env-keys.txt` for the full key list.
