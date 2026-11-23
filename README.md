# Launch with Buildy

Public static copy of the SiteWizard "Launch with Buildy" affiliate page.

- Intended custom domain: https://buildy.sitewizard.pro/ (DNS and GitHub Pages SSL still pending)
- Temporary preview: https://sitewizard-buildy.netlify.app/
- After Pages is enabled, the GitHub Pages hostname will be: https://fincap30.github.io/buildy-sitewizard-pro/

Register and contact forms post to the Netlify site so submissions stay in Netlify Forms.
The Buildy Meta pixel (`/buildy-pixel.js`, ID 1773080567134254) stays on this page.

Images are fetched from the Netlify copy during the Pages deploy workflow (the GitHub connector cannot push binaries).

This repository contains no secrets, tokens, or credentials.

## To go live

1. In this repo, open Settings → Pages and set Source to **GitHub Actions**.
2. Re-run the "Deploy GitHub Pages" workflow (or push a commit).
3. Add a Hostinger DNS CNAME only: name `buildy`, value `fincap30.github.io`. Do not change the apex, MX, or TXT records.
4. Wait for GitHub to issue the HTTPS certificate, then turn on "Enforce HTTPS".
