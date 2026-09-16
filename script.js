// mobile nav
const menuIcon = document.getElementById('menu-icon');
const navlist = document.getElementById('navlist');
menuIcon.onclick = () => {
  navlist.classList.toggle('open');
  const icon = menuIcon.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-xmark');
};
navlist.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navlist.classList.remove('open');
    menuIcon.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
  });
});

// scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i % 4) * 0.08 + 's';
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.pcard').forEach(el => observer.observe(el));

// terminal typing strip
const lines = [
  'whoami  ->  full-stack developer, Kumasi, Ghana',
  'status  ->  open for freelance work',
  'focus   ->  Creating scalable software with uncompromising quality.'
];
const typedEl = document.getElementById('typed-line');
let lineIndex = 0, charIndex = 0, deleting = false;
function typeLoop() {
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
}
typeLoop();

// tilt effect on hero photo
const tiltEl = document.getElementById('tilt-photo');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (tiltEl && !prefersReducedMotion) {
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

// contact form — AJAX submit so people stay on the branded page
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
    submitBtn.innerHTML = 'Sending...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        statusEl.textContent = "Thanks — your message is in. I'll get back to you soon.";
        statusEl.classList.add('success');
        contactForm.reset();
      } else {
        statusEl.textContent = "Something went wrong sending that. Try again, or email me directly.";
        statusEl.classList.add('error');
      }
    } catch (err) {
      statusEl.textContent = "Network error — check your connection and try again.";
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });
}
// portfolio card tilt + dot pagination
document.querySelectorAll('.pcard').forEach(card => {
  if (!prefersReducedMotion) {
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