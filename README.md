# Cycle Data

An interactive D3.js visualization mapping 4 menstrual cycles of Oura Ring biometric data, represented as circular objects. See [SPEC.md](SPEC.md) for full details.

## Token Setup

**OAuth2 required.** Personal access tokens were deprecated in December 2025.

1. Create an [OAuth application](https://cloud.ouraring.com/oauth/applications).
2. Add `http://localhost:3000/callback` to your app's **Redirect URIs**.
3. Put `OURA_CLIENT_ID` and `OURA_CLIENT_SECRET` in `.env`.
4. Run `npm run get-token` — your browser will open; authorize the app; the token is saved to `.env` as `OURA_TOKEN`.
5. Run `npm run fetch` to pull data and generate `data/daily.json`.

##Context and Inspiration

This visualization is contextualized against de Zambotti et al., which tracked 26 healthy women of similar age using the Oura ring across four menstrual cycle phases. Their population showed no significant variation in sleep architecture (deep sleep, REM, light sleep) across the cycle, with only marginal sleep efficiency reduction in mid-luteal. Heart rate and skin temperature showed significant biphasic increases in luteal. This project asks whether consistent strength training shifts those baselines — particularly deep sleep and HRV — in a single subject across four cycles.

de Zambotti, M., Goldstone, A., Colrain, I. M., & Baker, F. C. (2022). Tracking sleep, temperature, heart rate, and daily symptoms across the menstrual cycle with the Oura Ring in healthy women. International Journal of Women's Health, 14, 491–503. https://doi.org/10.2147/IJWH.S341917

##Objects

Each menstrual cycle is represented by a circular object, with angular sweep representing cycle length and a warm/cool color shift at follicular→luteal transition. Deep sleep duration is indicated by the radius of the outer line, and HRV balance is indicated by the thickness of that line, given the established relationship between these variables and recovery. REM sleep is represented by the radius of the inner line, and Oura's sleep efficiency metric (% time spent asleep compared to time spent awake while in bed - sleep efficiency of 85% is a sign of peaceful and uninterrupted sleep) is represented by the thickness of this line. Sleep efficiency reflects sleep continuity and fragmentation, which is the primary mechanism through which luteal phase changes affect REM architecture. The research showed sleep efficiency marginally drops in mid-luteal in the control population — pairing it with REM thickness means both the radius and weight of the inner ring respond to the same underlying disruption signal. 