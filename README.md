# Launch with Buildy

Public static copy of the SiteWizard "Launch with Buildy" affiliate page.

- **Live:** https://buildy.sitewizard.pro/
- GitHub Pages hostname: https://fincap30.github.io/buildy-sitewizard-pro/
- Netlify copy (forms backend): https://sitewizard-buildy.netlify.app/

Hosted on GitHub Pages. DNS is a Hostinger CNAME only: `buildy` → `fincap30.github.io`. The sitewizard.pro apex is not pointed here.

Register and contact forms post to the Netlify site so submissions stay in Netlify Forms.
The Buildy Meta pixel (`/buildy-pixel.js`, ID 1773080567134254) stays on this page.

Images are fetched from the Netlify copy during the Pages deploy workflow (the GitHub connector cannot push binaries).

This repository contains no secrets, tokens, or credentials.

## Notes

- GitHub Pages 301s `/reviews` to `/reviews/` (and the same for the other routes). That is expected.
- "Enforce HTTPS" on the custom domain may still need to be turned on in Settings → Pages.
- The reviews list is loaded from Buildy's API, which currently allows the original Superdev origin only. If reviews are empty or fail, add `https://buildy.sitewizard.pro` to that allowlist in Buildy.
