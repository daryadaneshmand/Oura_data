/**
 * One-time OAuth2 flow to obtain Oura access token.
 * Run: npm run get-token
 *
 * Prerequisites:
 * - OURA_CLIENT_ID and OURA_CLIENT_SECRET in .env
 * - Add http://localhost:3000/callback to your Oura OAuth app's redirect URIs
 *
 * Flow:
 * 1. Starts Express on port 3000
 * 2. Opens browser to Oura authorization URL (scopes: daily workout personal)
 * 3. User authorizes in browser
 * 4. Oura redirects to /callback with ?code=...
 * 5. Exchanges code for access token
 * 6. Appends OURA_TOKEN to .env
 * 7. Shuts down
 */

import "dotenv/config";
import express from "express";
import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import open from "open";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REDIRECT_URI = "http://localhost:3000/callback";
// Use only documented Oura scopes. Invalid names (e.g. ring_configuration, heart_health) may cause issues.
const SCOPES = "email personal daily heartrate workout tag session spo2 stress";

const app = express();
let server;

app.get("/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    res.send(`<h1>Authorization failed</h1><p>${error}</p>`);
    shutdown(1);
    return;
  }

  if (!code) {
    res.send("<h1>No authorization code received</h1>");
    shutdown(1);
    return;
  }

  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.send("<h1>Missing OURA_CLIENT_ID or OURA_CLIENT_SECRET in .env</h1>");
    shutdown(1);
    return;
  }

  try {
    const tokenRes = await fetch("https://api.ouraring.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      res.send(`<h1>Token exchange failed</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
      shutdown(1);
      return;
    }

    const accessToken = data.access_token;
    console.log("Token response scope (granted):", data.scope ?? "(not in response)");
    if (data.scope) {
      console.log("Granted scopes:", data.scope.split(" ").join(", "));
    }

    const envPath = join(__dirname, "..", ".env");

    // Update or append OURA_TOKEN
    let envContent = readFileSync(envPath, "utf8");
    if (envContent.includes("OURA_TOKEN=")) {
      envContent = envContent.replace(/OURA_TOKEN=.*/m, `OURA_TOKEN=${accessToken}`);
      writeFileSync(envPath, envContent, "utf8");
    } else {
      appendFileSync(envPath, `\nOURA_TOKEN=${accessToken}\n`, "utf8");
    }

    res.send(`
      <h1>Success!</h1>
      <p>Access token saved to .env as OURA_TOKEN.</p>
      <p>You can close this tab. The server will shut down.</p>
    `);

    console.log("Token saved to .env as OURA_TOKEN.");
    shutdown(0);
  } catch (err) {
    res.send(`<h1>Error</h1><pre>${err.message}</pre>`);
    console.error(err);
    shutdown(1);
  }
});

function shutdown(exitCode) {
  if (server) server.close(() => process.exit(exitCode));
  else process.exit(exitCode);
}

async function main() {
  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("OURA_CLIENT_ID and OURA_CLIENT_SECRET must be set in .env");
    process.exit(1);
  }

  const authUrl = new URL("https://cloud.ouraring.com/oauth/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", SCOPES);

  server = app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
    console.log("Opening browser to Oura authorization...");
    open(authUrl.toString());
    console.log("\n1. Authorize the app in the browser");
    console.log("2. You will be redirected back here");
    console.log("3. Token will be saved to .env as OURA_TOKEN\n");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
