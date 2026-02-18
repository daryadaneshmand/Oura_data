# Cycle Resilience Arc

An interactive D3.js visualization mapping 4 menstrual cycles of Oura Ring biometric data onto animated resilience arc paths. See [SPEC.md](SPEC.md) for full details.

## Token Setup

**OAuth2 required.** Personal access tokens were deprecated in December 2025.

1. Create an [OAuth application](https://cloud.ouraring.com/oauth/applications).
2. Add `http://localhost:3000/callback` to your app's **Redirect URIs**.
3. Put `OURA_CLIENT_ID` and `OURA_CLIENT_SECRET` in `.env`.
4. Run `npm run get-token` — your browser will open; authorize the app; the token is saved to `.env` as `OURA_TOKEN`.
5. Run `npm run fetch` to pull data and generate `data/daily.json`.
