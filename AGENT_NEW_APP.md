# Agent instructions: new app from nuxt-v4-template

**When you need to create a new app from nuxt-v4-template**, follow this exactly.

## 1. Get these variables

Ask the user (or use env) for:

- **APP_NAME** – Slug for the app, e.g. `my-app` (lowercase, hyphens only). Used for package name, Doppler project, Pages project, D1 DB name.
- **SITE_URL** – Full public URL. **Use the exact URL Cloudflare gives** after the first deploy; if Pages assigns a suffixed URL (e.g. `my-app-47d.pages.dev`), use that everywhere.

If the user already gave an app name or URL, derive the other if needed (e.g. `SITE_URL` = `https://<APP_NAME>.pages.dev`).

## 2. Checkout the template with gh

Use the GitHub CLI to clone the template into a folder named **APP_NAME** (or the parent directory you’re in). Then work from that directory.

```bash
gh repo clone loganrenz/nuxt-v4-template <APP_NAME>
cd <APP_NAME>
```

If the repo is under a different org/user, use that instead of `loganrenz`. You must have **gh** installed and authenticated (`gh auth status`).

## 3. Run the setup script

From the **repo root** of the cloned app (the directory that contains `package.json` and `scripts/setup-new-app.mjs`):

```bash
npm run setup:new-app -- <APP_NAME> <SITE_URL>
```

Or: `node scripts/setup-new-app.mjs <APP_NAME> <SITE_URL>`.

Example:

```bash
npm run setup:new-app -- simple-game-3 https://simple-game-3.pages.dev
```

Do **not** replace placeholders with example values in the command you run; use the actual APP_NAME and SITE_URL.

## 4. Run the two finish commands (required)

Setup is not complete until these two commands are run. **You must run them** (from the app directory), or give the user the exact commands with their real **SITE_URL** so they can copy-paste.

1. **Deploy** (from the app repo root):
   ```bash
   doppler run -- npm run deploy
   ```

2. **GSC verify** (use the same SITE_URL as in step 3; quote it for the shell):
   ```bash
   SITE_URL="https://<APP_NAME>.pages.dev" doppler run --project nuxt_template --config base -- npm run setup:gsc:verify
   ```
   Replace `<APP_NAME>.pages.dev` with the user’s actual SITE_URL host (e.g. `SITE_URL="https://snake-game.pages.dev"`).

   **Important:** Run GSC verify only after the **production** URL (SITE_URL) is live. Cloudflare Pages may serve a preview URL first; production can take 1–2 minutes. If GSC verify fails with *"The necessary verification token could not be found on your site"*, wait 1–2 minutes or run deploy again, then retry the GSC verify command.

**Example output to give the user** (with their APP_NAME and SITE_URL filled in):

> Setup completed successfully. Here’s what was configured:  
> APP_NAME: **snake-game**  
> SITE_URL: **https://snake-game.pages.dev**  
> D1 database: snake-game-db  
> Doppler project: snake-game  
>
> **Now run these two commands to finish:**  
>
> **Deploy:**  
> `doppler run -- npm run deploy`  
>
> **GSC verify** (run only after production is live at the SITE_URL; if it fails with "verification token could not be found", wait 1–2 min or redeploy, then retry):  
> `SITE_URL="https://snake-game.pages.dev" doppler run --project nuxt_template --config base -- npm run setup:gsc:verify`

## 5. If the user needs more detail

Point them to **SETUP.md** for full prerequisites, manual steps, and day-to-day commands. For gtag/GA4 integration, see **AGENT_GTAG.md**.

## Summary

1. Get **APP_NAME** and **SITE_URL**.
2. Checkout template: `gh repo clone loganrenz/nuxt-v4-template <APP_NAME>` then `cd <APP_NAME>`.
3. Run: `npm run setup:new-app -- <APP_NAME> <SITE_URL>`.
4. **You must run or hand off:** `doppler run -- npm run deploy`, then (after production is live) `SITE_URL="<their SITE_URL>" doppler run --project nuxt_template --config base -- npm run setup:gsc:verify`. If GSC verify fails with "verification token could not be found", wait 1–2 min or redeploy, then retry.

No .env is used; all secrets are in Doppler (shared nuxt_template for setup, per-app Doppler for the app’s own SITE_URL and GA_MEASUREMENT_ID).
