# Amvisphere Limited — Company Website

The official website for **Amvisphere Limited**, a British cleaning company.

- **Domain:** [amvisphereltd.co.uk](https://amvisphereltd.co.uk)
- **Email:** info@amvispherltd.com
- **Phone:** 07498 895296

## Structure

```
.
├── index.html          # Home
├── services.html       # Services (domestic, commercial, deep, tenancy, sparkle, carpet)
├── about.html          # About us, values, guarantee
├── areas.html          # Areas covered across the UK
├── contact.html        # Contact form & details
├── robots.txt
├── sitemap.xml
├── CNAME               # Custom domain for GitHub Pages
└── assets/
    ├── css/style.css
    └── js/main.js
```

The site is built as plain static HTML/CSS with a touch of vanilla JS — no
build step required.

## Running locally

Just open `index.html` in any modern browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deployment

The repository is ready for **GitHub Pages**:

1. In the repo settings, enable Pages and choose the deployment branch.
2. The `CNAME` file points the site at `amvisphereltd.co.uk`.
3. Add the appropriate DNS records at your registrar (an A or CNAME record
   pointing to GitHub Pages).

It can also be deployed as-is to **Netlify**, **Cloudflare Pages**, **Vercel**,
or any static host.

## Design

- **Palette:** baby blue (`#A7D8F0`), soft tints, white, and dark navy (`#0E2A47`).
- **Typography:** Manrope (body) and Fraunces (display) from Google Fonts.
- **Voice:** professional, warm and unmistakably British.
