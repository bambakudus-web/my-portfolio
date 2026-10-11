# DevKelly | Portfolio

Personal portfolio of Harruna Abdul Kudus (DevKelly), a full-stack developer in Kumasi, Ghana.
Plain HTML, CSS and JavaScript. No build step.

## Run it
Open `index.html` in a browser, or serve the folder (for example with the VS Code "Live Server" extension).

## Files
| File | What it is |
|---|---|
| `index.html` | The whole page: hero, projects, about, services, skills, contact |
| `style.css` | All styling and the phone layout |
| `script.js` | Menu, scroll effects, typing line, screenshot dots, contact form |
| `images/` | Photo, share-preview picture and project screenshots |
| `files/cv.pdf` | The CV behind the "Download CV" button |

## Adding project screenshots
Three project cards (CampusCart, ARIZONA GBC, CA Analytics) and KellyPOS show a grey "Screenshots coming soon" box.
Open `index.html`, find the card, delete the `<div class="mock-screen">...</div>` block, and put your images there.
Each card has a comment showing the exact lines to paste. The first image needs `class="active"`.
Keep each image under about 300 KB (WebP or compressed PNG) so the page stays fast on mobile data.

## Before you publish
Replace `https://your-domain-here.com/` in the share-preview tags near the top of `index.html`
(`og:url`, `og:image`, `twitter:image`) with the real address of the site.
