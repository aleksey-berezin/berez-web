# berez-web

Marketing website for **Berez Investment Group** — a boutique multifamily investment company in the Portland Metro area.

Production: **https://www.berez.in**

## Stack

- **Static site generator**: [Eleventy](https://www.11ty.dev) 3.1 with the Liquid templating engine
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com) (Free plan, auto-deploys from `main`)
- **DNS**: Cloudflare (registrar is Namecheap, nameservers delegated to `*.ns.cloudflare.com`)
- **Email**: Microsoft 365 (shared mailbox at `hello@berez.in`)
- **Analytics**: Cloudflare Web Analytics (zone-level) + Google Analytics 4
- **Tooling**: Biome (format + lint), esbuild (JS bundling), lightningcss (CSS minification), sharp + eleventy-img (responsive images)

## Local development

```bash
npm install
npm start      # dev server on http://localhost:8080 with live reload
npm run build  # production build into _site/
```

Node version is pinned to **24** via `.nvmrc`.

## Deployment

Every push to `main` triggers an automatic Cloudflare Pages build. Preview deployments are generated for any branch push.

- **Production URL**: https://www.berez.in
- **Preview URLs**: `https://{commit-hash}.berez-web.pages.dev`

Pages project build settings:

| Setting | Value |
|---|---|
| Framework preset | Eleventy |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Root directory | `/` (repo root) |
| `NODE_VERSION` env var | `24` |

## Repository layout

```
_source/              Site source
  _data/              Eleventy global data (site.json)
  _includes/          Liquid partials
  _layouts/           Page layouts
  _utilities/         Build-time helpers (image, CSS, JS, favicon generation)
  assets/
    css/              main.css + component/utility partials
    fonts/            Web fonts (passthrough copied)
    images/           Source images (processed by eleventy-img)
    js/               app.js + _elements/ (progressive-enhancement modules)
  index.html          Home page
  404.html            Error page
  robots.liquid       Generates robots.txt
  sitemap.liquid      Generates sitemap.xml
  _redirects          Cloudflare Pages redirect rules (copied to _site/_redirects at build)
_site/                Build output (gitignored)
docs/                 Internal project notes (excluded from build via .eleventyignore)
eleventy.config.js    Eleventy configuration
package.json
.nvmrc                Node version pin (24)
```

## Redirects

`_source/_redirects` defines native Cloudflare Pages redirect rules, currently used to deflect WordPress/scanner probes:

```
/wp-login.php / 301
/xmlrpc.php / 301
/.env / 301
/wp-content/* / 301
/wp-includes/* / 301
/wp-admin/* / 301
/.git/* / 301
```

Apex-to-www redirects (`berez.in` → `www.berez.in`) are handled by a Cloudflare **Redirect Rule** at the edge, not by this file.

## Contact form

The site routes all contact via a `mailto:hello@berez.in` button. There is no server-side form handler — `hello@berez.in` is a shared mailbox on Microsoft 365 with its own spam filtering. A form-based contact handler was intentionally removed during the Cloudflare migration because ~100% of submissions were spam.

## Migration notes

This repository was previously hosted on [CloudCannon](https://cloudcannon.com) as a CMS-managed static site. In April 2026 it was migrated to Cloudflare Pages to consolidate hosting, DNS, and analytics under a single vendor and to unlock Cloudflare-native features (Access, Web Analytics, R2, D1, Workers).

The CloudCannon-era files (`cloudcannon.config.yml`, `.cloudcannon/`) have been removed. Historical DNS records from before the switch are preserved in [`docs/dns-records-2026-01-12.md`](docs/dns-records-2026-01-12.md) for reference.

## License

See [LICENSE](LICENSE).
