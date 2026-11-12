# DevKelly | Portfolio

Personal portfolio of Harruna Abdul Kudus (DevKelly), a full-stack developer in Kumasi, Ghana.
The page is plain HTML, CSS and JavaScript. A small Node/Express server serves it and sends the contact form through Brevo.

## Run it locally
```bash
npm install
cp .env.example .env      # then fill in the three values
npm run dev               # http://localhost:3000
```
Opening `index.html` directly still shows the page, but the contact form needs the server.

## Contact form (Brevo)
1. In Brevo, create an API key (SMTP & API > API Keys) and verify a sender (Senders, Domains & Dedicated IPs).
2. Set these variables locally in `.env` and on Railway under Variables:
   - `BREVO_API_KEY`
   - `CONTACT_TO_EMAIL` (your inbox)
   - `CONTACT_FROM_EMAIL` (the verified sender)
   - `CONTACT_FROM_NAME` (optional)
3. Never put the API key in `index.html` or `script.js`. It stays on the server.

## Deploy on Railway
Push to GitHub, create a Railway project from the repo, add the variables above. Railway runs `npm start`.

## Files
| File | What it is |
|---|---|
| `index.html` | The whole page |
| `style.css` | All styling and the phone layout |
| `script.js` | Menu, scroll effects, typing line, screenshot dots, contact form |
| `server.js` | Serves the site and handles `POST /api/contact` |
| `images/` | WebP screenshots (about 1100px wide), portrait, share-preview JPG |
| `files/cv.pdf` | The CV behind the "Download CV" button |

## Adding screenshots
Export at about 1100px wide as WebP (quality 75 to 80). Keep each under about 60 KB.
Add `width` and `height` attributes that match the file, and `loading="lazy"` on everything below the first screen.

## Before you publish
Replace `https://your-domain-here.com/` in the share-preview tags near the top of `index.html`
(`og:url`, `og:image`, `twitter:image`) with the real address of the site.
