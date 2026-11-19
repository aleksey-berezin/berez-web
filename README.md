# berez-web

The website for **Berez Investment Group**, a boutique multifamily investment company in the Portland Metro area.

Live at **https://www.berez.in**

It is one page, built with [Eleventy](https://www.11ty.dev) and hosted on [Cloudflare Pages](https://pages.cloudflare.com). There are two dependencies: Eleventy itself and its image plugin.

## Working on it

```bash
npm install
npm start      # http://localhost:8080, reloads as you edit
npm run build  # writes the finished site to _site/
```

Node is pinned to version 24 in `.nvmrc`.

## Where things are

```
_source/
  index.html            The page: every section, top to bottom
  404.html              Error page
  sitemap.liquid        Generates sitemap.xml
  _includes/
    layout.html         The <head>, header and footer shared by both pages
    styles.css          All the CSS, inlined into the page head
    site.js             All the JavaScript, inlined the same way
  _data/
    site.json           Name, URL, email, navigation, "last updated" date
    properties.json     The portfolio
    faq.json            Questions and answers
    schema.js           Structured data for search engines, built from the files above
  photos/               Property photos (resized automatically at build time)
  public/               Copied to the site root untouched:
                        fonts, favicons, og-image, partner logos,
                        robots.txt, _redirects, _headers (caching and security)
eleventy.config.js      20 lines: image plugin and the public/ copy
```

## Common changes

**Edit the text.** Open `_source/index.html`. The sections appear in page order, each in a `<section id="…">`.

**Add or change a property.** Edit `_source/_data/properties.json` and put the photo in `_source/photos/`.

**Add or change an FAQ.** Edit `_source/_data/faq.json`. `answer` is the bold one-line answer that is always visible; `detail` is the list of paragraphs behind the plus sign. The search-engine version updates itself.

**Refresh the market data.** Update the figures and sources in the "Why Portland" section of `index.html`, then change `updated` in `_source/_data/site.json`. That date drives the "last updated" line, the sitemap and the structured data.

**Change the navigation.** Edit `nav` in `site.json`. Each `id` must match a section's `id` in `index.html`.

**Change colours, type or spacing.** They are variables at the top of `_source/_includes/styles.css`.

## How it works

- **Images.** Write a plain `<img src="/photos/name.jpg" alt="…" sizes="…">`. At build time the [image plugin](https://www.11ty.dev/docs/plugins/image/) turns it into a `<picture>` with AVIF, WebP and JPEG versions at four widths.
- **Navigation.** One `<nav popover>` serves both layouts. On phones it is a native browser popover opened by the header button; from 768px it is a sticky list beside the content. No JavaScript opens or closes it.
- **JavaScript.** `_includes/site.js` is about seventy lines, inlined into the page so it costs no extra request: scroll-reveal, the count-up on the four market statistics, the phone contact bar, closing the phone menu when a link is tapped, and marking the current section in the navigation. The page is complete without it.
- **Motion.** All animation sits in one block at the end of `styles.css` and is skipped for visitors who have reduced motion turned on.
- **Social preview.** `public/og-image.png` is rendered from `og-image.svg` beside it. After editing the SVG, re-render it:

  ```bash
  node -e "import('sharp').then(({default:s})=>s('_source/public/og-image.svg').png().toFile('_source/public/og-image.png'))"
  ```

## Deployment

Every push to `main` builds and deploys on Cloudflare Pages. Other branches get preview URLs at `https://{commit-hash}.berez-web.pages.dev`.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `_site` |
| `NODE_VERSION` | `24` |

DNS is on Cloudflare. The redirect from `berez.in` to `www.berez.in` is a Cloudflare Redirect Rule, not part of this repository. `public/_redirects` only deflects WordPress and scanner probes.

## Contact

All contact goes through `mailto:hello@berez.in`, a shared Microsoft 365 mailbox. There is deliberately no contact form: the old one received almost nothing but spam.

## History

The site was moved from CloudCannon to Cloudflare Pages in April 2026, and rebuilt from a starter template into the current hand-written codebase in November 2026. The DNS records as they stood before the move are kept in [`docs/dns-records-2026-01-12.md`](docs/dns-records-2026-01-12.md).

## License

See [LICENSE](LICENSE).
