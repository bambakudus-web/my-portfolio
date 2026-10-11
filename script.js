const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- mobile nav ----------
const menuIcon = document.getElementById('menu-icon');
const navlist = document.getElementById('navlist');

function setMenu(open) {
  navlist.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
  menuIcon.setAttribute('aria-expanded', String(open));
  menuIcon.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  const icon = menuIcon.querySelector('i');
  icon.classList.toggle('fa-bars', !open);
  icon.classList.toggle('fa-xmark', open);
}
menuIcon.addEventListener('click', () => setMenu(!navlist.classList.contains('open')));
navlist.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navlist.classList.contains('open')) { setMenu(false); menuIcon.focus(); }
});
// tapping outside the open menu closes it
document.addEventListener('click', (e) => {
  if (navlist.classList.contains('open') && !navlist.contains(e.target) && !menuIcon.contains(e.target)) setMenu(false);
});
// rotating a phone or resizing to desktop must not leave the page locked
window.addEventListener('resize', () => { if (window.innerWidth > 768) setMenu(false); });

// ---------- highlight the current section in the nav ----------
const navLinks = [...navlist.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(sec => spy.observe(sec));
}

// ---------- scroll reveal (project cards) ----------
const cards = document.querySelectorAll('.pcard');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i % 4) * 0.08 + 's';
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(el => observer.observe(el));
  // safety net: never leave a card hidden if the observer is slow or blocked
  setTimeout(() => cards.forEach(el => el.classList.add('in-view')), 3000);
} else {
  cards.forEach(el => el.classList.add('in-view'));
}

// ---------- terminal typing strip ----------
const lines = [
  'whoami  ->  full-stack developer, Kumasi, Ghana',
  'status  ->  open for freelance work',
  'focus   ->  Creating scalable software with uncompromising quality.'
];
const typedEl = document.getElementById('typed-line');
if (typedEl) {
  if (prefersReducedMotion) {
    typedEl.textContent = lines[0];
  } else {
    let lineIndex = 0, charIndex = 0, deleting = false;
    const typeLoop = () => {
      const current = lines[lineIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
        }
      }
      setTimeout(typeLoop, deleting ? 20 : 38);
    };
    typeLoop();
  }
}

// ---------- tilt effects (mouse only, never on touch screens) ----------
const tiltEl = document.getElementById('tilt-photo');
if (tiltEl && !prefersReducedMotion && canHover) {
  tiltEl.addEventListener('mousemove', (e) => {
    const rect = tiltEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltEl.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
  tiltEl.addEventListener('mouseleave', () => {
    tiltEl.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
  });
}

// ---------- project cards: tilt + screenshot dots ----------
cards.forEach(card => {
  if (!prefersReducedMotion && canHover) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = card.classList.contains('in-view') ? 'translateY(0)' : '';
    });
  }

  const imgs = card.querySelectorAll('.pcard-media img');
  const dotsWrap = card.querySelector('.dots');
  if (imgs.length > 1 && dotsWrap) {
    imgs.forEach((img, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show screenshot ${i + 1} of ${imgs.length}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        imgs.forEach(im => im.classList.remove('active'));
        img.classList.add('active');
        dotsWrap.querySelectorAll('button').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
      dotsWrap.appendChild(dot);
    });
  }
});

// ---------- contact form: send in the background so people stay on the page ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const statusEl = document.getElementById('formStatus');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnHTML = submitBtn.innerHTML;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        statusEl.textContent = "Thanks, your message is in. I'll get back to you soon.";
        statusEl.classList.add('success');
        contactForm.reset();
      } else {
        statusEl.textContent = "Something went wrong sending that. Please try again in a moment.";
        statusEl.classList.add('error');
      }
    } catch (err) {
      statusEl.textContent = "Network error. Check your connection and try again.";
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });
}
