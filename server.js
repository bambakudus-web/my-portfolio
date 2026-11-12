'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;     // where messages arrive (your inbox)
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL; // must be a verified sender in Brevo
const CONTACT_FROM_NAME = process.env.CONTACT_FROM_NAME || 'DevKelly Portfolio';

app.set('trust proxy', 1); // Railway sits behind a proxy, so req.ip is the visitor's IP
app.disable('x-powered-by');
app.use(compression());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ---------- static site (only the public files, never server.js or .env) ----------
const ROOT = __dirname;
app.use('/images', express.static(path.join(ROOT, 'images'), { maxAge: '30d' }));
app.use('/files', express.static(path.join(ROOT, 'files'), { maxAge: '1d' }));
app.get('/style.css', (req, res) => res.set('Cache-Control', 'public, max-age=3600').sendFile(path.join(ROOT, 'style.css')));
app.get('/script.js', (req, res) => res.set('Cache-Control', 'public, max-age=3600').sendFile(path.join(ROOT, 'script.js')));
app.get('/', (req, res) => res.set('Cache-Control', 'no-cache').sendFile(path.join(ROOT, 'index.html')));

// ---------- contact form -> Brevo ----------
const hits = new Map(); // ip -> [timestamps], simple in-memory rate limit
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) {
    const recent = times.filter(t => now - t < WINDOW_MS);
    recent.length ? hits.set(ip, recent) : hits.delete(ip);
  }
}, WINDOW_MS).unref();

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ').trim();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/contact', express.json({ limit: '10kb' }), async (req, res) => {
  const body = req.body || {};

  // Honeypot: bots fill this hidden field. Pretend success so they move on.
  if (body.website) return res.json({ ok: true });

  if (rateLimited(req.ip)) {
    return res.status(429).json({ error: 'Too many messages from this connection. Please try again in a few minutes.' });
  }

  const name = oneLine(body.name || '');
  const email = oneLine(body.email || '');
  const message = String(body.message || '').trim();

  if (!name || name.length > 100) return res.status(400).json({ error: 'Please enter your name.' });
  if (!EMAIL_RE.test(email) || email.length > 200) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (message.length < 10 || message.length > 4000) return res.status(400).json({ error: 'Please write a message between 10 and 4000 characters.' });

  if (!BREVO_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form is not configured: set BREVO_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.');
    return res.status(500).json({ error: 'The contact form is not available right now. Please email me directly.' });
  }

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': BREVO_API_KEY },
      body: JSON.stringify({
        sender: { name: CONTACT_FROM_NAME, email: CONTACT_FROM_EMAIL },
        to: [{ email: CONTACT_TO_EMAIL }],
        replyTo: { email, name },
        subject: `New portfolio message from ${name}`.slice(0, 150),
        textContent: `From: ${name} <${email}>\n\n${message}`,
        htmlContent: `<p><strong>From:</strong> ${escapeHtml(name)} (<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>)</p>` +
                     `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!brevoRes.ok) {
      console.error('Brevo rejected the email:', brevoRes.status, await brevoRes.text());
      return res.status(502).json({ error: 'Could not send your message right now. Please try again shortly.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Brevo request failed:', err.message);
    res.status(502).json({ error: 'Could not send your message right now. Please try again shortly.' });
  }
});

app.listen(PORT, () => console.log(`DevKelly portfolio running on port ${PORT}`));
