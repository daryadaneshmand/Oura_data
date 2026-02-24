# Cycle Resilience Arc

An interactive D3.js visualization mapping 4 menstrual cycles of Oura Ring biometric data onto animated resilience arc paths. See [SPEC.md](SPEC.md) for full details.

## Token Setup

**OAuth2 required.** Personal access tokens were deprecated in December 2025.

1. Create an [OAuth application](https://cloud.ouraring.com/oauth/applications).
2. Add `http://localhost:3000/callback` to your app's **Redirect URIs**.
3. Put `OURA_CLIENT_ID` and `OURA_CLIENT_SECRET` in `.env`.
4. Run `npm run get-token` — your browser will open; authorize the app; the token is saved to `.env` as `OURA_TOKEN`.
5. Run `npm run fetch` to pull data and generate `data/daily.json`.

## Deploy to Vercel

### Option A: Static deploy (simplest)

Your visualizations load pre-built `data/daily.json` — no API calls from the browser. Deploy as a static site:

1. Push your repo to GitHub (ensure `data/daily.json` is committed).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
3. Leave **Build Command** empty (or remove it). **Output Directory** = `.` or leave default.
4. Deploy. Your app will be live at `https://your-project.vercel.app`.

To refresh data: run `npm run fetch` locally, commit the updated `data/daily.json`, and push. Vercel will redeploy automatically.

### Option B: Fetch on deploy (fresh data every deploy)

1. In Vercel: Project → **Settings** → **Environment Variables**.
2. Add `OURA_TOKEN` with your Oura access token (from `npm run get-token`).
3. Set **Build Command** to `npm run build` (runs the fetch script during deploy).
4. Deploy. Each deployment will pull fresh data from the Oura API.

**Security:** Never commit `.env`. Your token stays in Vercel's env vars and is not exposed to the browser.
