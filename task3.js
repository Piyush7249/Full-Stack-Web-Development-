/* ════════════════════════════════════════
   TASK 3 — JavaScript
   1. Multi-page navigation
   2. Form validation
   3. LocalStorage save
   4. Submissions display
════════════════════════════════════════ */

// ── 1. NAVIGATION ──────────────────────
const navLinks  = document.querySelectorAll('.nav-links a');
const pages     = document.querySelectorAll('.page');
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-links');

function showPage(target) {
  // Hide all pages, deactivate all links
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(a => a.classList.remove('active'));

  // Show target page
  const page = document.getElementById(target);
  if (page) page.classList.add('active');

  // Highlight active nav link
  navLinks.forEach(a => {
    if (a.dataset.target === target) a.classList.add('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  navMenu.classList.remove('open');

  // Trigger animations on specific pages
  if (target === 'about') {
    setTimeout(animateSkillBars, 350);
  }
  if (target === 'submissions') {
    renderSubmissions();
  }
}

// Nav link clicks
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.target);
  });
});

// Any element with data-nav attribute (buttons / CTAs)
document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    showPage(el.dataset.nav);
  });
});

// Hamburger toggle
navToggle && navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// ── 2. SKILL BARS ANIMATION ────────────
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = (bar.dataset.width || 0) + '%';
  });
}

// ── 3. FORM VALIDATION ─────────────────
const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateForm()) {
      saveToLocalStorage();
      showSuccess();
    }
  });
}

// Helper: get trimmed value
function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

// Set an error on a field
function setErr(id, msg) {
  const input = document.getElementById(id);
  const errEl = document.getElementById(id + 'Error');
  if (input) input.classList.add('error');
  if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
}

// Clear an error from a field
function clearErr(id) {
  const input = document.getElementById(id);
  const errEl = document.getElementById(id + 'Error');
  if (input) input.classList.remove('error');
  if (errEl) errEl.classList.remove('show');
}

function validateForm() {
  const fields = ['fname', 'lname', 'email', 'phone', 'subject', 'message'];
  fields.forEach(clearErr);
  let ok = true;

  // First Name
  if (!val('fname')) {
    setErr('fname', 'First name is required.'); ok = false;
  } else if (val('fname').length < 2) {
    setErr('fname', 'Must be at least 2 characters.'); ok = false;
  }

  // Last Name
  if (!val('lname')) {
    setErr('lname', 'Last name is required.'); ok = false;
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val('email')) {
    setErr('email', 'Email address is required.'); ok = false;
  } else if (!emailRegex.test(val('email'))) {
    setErr('email', 'Enter a valid email address.'); ok = false;
  }

  // Phone — Indian 10-digit mobile
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!val('phone')) {
    setErr('phone', 'Phone number is required.'); ok = false;
  } else if (!phoneRegex.test(val('phone'))) {
    setErr('phone', 'Enter a valid 10-digit Indian mobile number.'); ok = false;
  }

  // Subject
  if (!val('subject')) {
    setErr('subject', 'Please select a subject.'); ok = false;
  }

  // Message
  if (!val('message')) {
    setErr('message', 'Message cannot be empty.'); ok = false;
  } else if (val('message').length < 20) {
    setErr('message', 'Message must be at least 20 characters.'); ok = false;
  }

  return ok;
}

// Live clear on input
['fname', 'lname', 'email', 'phone', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearErr(id));
});

// ── 4. LOCALSTORAGE — SAVE ─────────────
const LS_KEY = 'pc_submissions';

function saveToLocalStorage() {
  const submissions = getSubmissions();

  const entry = {
    id:      Date.now(),
    name:    val('fname') + ' ' + val('lname'),
    email:   val('email'),
    phone:   val('phone'),
    subject: val('subject'),
    message: val('message'),
    time:    new Date().toLocaleString('en-IN', {
               day: '2-digit', month: 'short', year: 'numeric',
               hour: '2-digit', minute: '2-digit'
             })
  };

  submissions.push(entry);
  localStorage.setItem(LS_KEY, JSON.stringify(submissions));
}

function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}

// ── 5. LOCALSTORAGE — DISPLAY ──────────
function renderSubmissions() {
  const submissions = getSubmissions();
  const grid        = document.getElementById('subGrid');
  const empty       = document.getElementById('subEmpty');
  const countEl     = document.getElementById('subCount');

  if (!grid) return;

  grid.innerHTML = '';
  if (countEl) countEl.textContent = submissions.length;

  if (submissions.length === 0) {
    if (empty) empty.style.display = 'block';
    grid.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';
  grid.style.display = 'grid';

  // Show newest first
  [...submissions].reverse().forEach((s, i) => {
    const initials = s.name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2);
    const card = document.createElement('div');
    card.className = 'sub-card';
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `
      <div class="sub-card-head">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="sub-avatar">${initials}</div>
          <div>
            <div class="sub-name">${escHtml(s.name)}</div>
            <div class="sub-email">${escHtml(s.email)}</div>
          </div>
        </div>
        <div class="sub-time">${escHtml(s.time)}</div>
      </div>
      <div class="sub-subject">${escHtml(s.subject)}</div>
      <div class="sub-msg">${escHtml(s.message)}</div>
    `;
    grid.appendChild(card);
  });
}

// Escape HTML to prevent XSS
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Clear all submissions
const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all saved submissions? This cannot be undone.')) {
      localStorage.removeItem(LS_KEY);
      renderSubmissions();
    }
  });
}

// ── 6. SUCCESS STATE ───────────────────
function showSuccess() {
  const banner = document.getElementById('successMsg');
  const btn    = document.getElementById('submitBtn');

  if (banner) banner.classList.add('show');
  if (btn)    { btn.textContent = '✅ Message Saved!'; btn.disabled = true; }

  form.reset();

  setTimeout(() => {
    if (banner) banner.classList.remove('show');
    if (btn)    { btn.innerHTML = '🚀 Send &amp; Save Message'; btn.disabled = false; }
  }, 5000);
}

// ── 7. INIT ────────────────────────────
showPage('home');
