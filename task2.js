// ── NAVIGATION ──
const navLinks = document.querySelectorAll('.nav-links a');
const pages    = document.querySelectorAll('.page');
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-links');

function showPage(target) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(a => a.classList.remove('active'));

  const page = document.getElementById(target);
  if (page) page.classList.add('active');

  navLinks.forEach(a => {
    if (a.dataset.target === target) a.classList.add('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  navMenu.classList.remove('open');

  // Trigger skill bar animation on About page
  if (target === 'about') {
    setTimeout(animateSkillBars, 400);
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.target);
  });
});

// CTA buttons that navigate
document.querySelectorAll('[data-nav]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    showPage(btn.dataset.nav);
  });
});

// Hamburger menu toggle
navToggle && navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// ── SKILL BARS ANIMATION ──
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const target = bar.dataset.width || '0';
    bar.style.width = target + '%';
  });
}

// ── FORM VALIDATION ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
      showSuccess();
    }
  });
}

function getVal(id)   { return document.getElementById(id)?.value.trim() || ''; }
function setError(id, msg) {
  const input = document.getElementById(id);
  const errEl = document.getElementById(id + 'Error');
  if (!input || !errEl) return;
  input.classList.add('error');
  errEl.textContent = msg;
  errEl.classList.add('show');
}
function clearError(id) {
  const input = document.getElementById(id);
  const errEl = document.getElementById(id + 'Error');
  if (!input || !errEl) return;
  input.classList.remove('error');
  errEl.classList.remove('show');
}

function validateForm() {
  let valid = true;
  const fields = ['fname', 'lname', 'email', 'phone', 'subject', 'message'];
  fields.forEach(clearError);

  // First name
  if (!getVal('fname')) {
    setError('fname', 'First name is required.'); valid = false;
  } else if (getVal('fname').length < 2) {
    setError('fname', 'Must be at least 2 characters.'); valid = false;
  }

  // Last name
  if (!getVal('lname')) {
    setError('lname', 'Last name is required.'); valid = false;
  }

  // Email
  const emailVal = getVal('email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal) {
    setError('email', 'Email address is required.'); valid = false;
  } else if (!emailRegex.test(emailVal)) {
    setError('email', 'Please enter a valid email address.'); valid = false;
  }

  // Phone
  const phoneVal = getVal('phone');
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneVal) {
    setError('phone', 'Phone number is required.'); valid = false;
  } else if (!phoneRegex.test(phoneVal)) {
    setError('phone', 'Enter a valid 10-digit Indian mobile number.'); valid = false;
  }

  // Subject
  if (!getVal('subject') || getVal('subject') === '') {
    setError('subject', 'Please select a subject.'); valid = false;
  }

  // Message
  if (!getVal('message')) {
    setError('message', 'Message cannot be empty.'); valid = false;
  } else if (getVal('message').length < 20) {
    setError('message', 'Message must be at least 20 characters.'); valid = false;
  }

  return valid;
}

// Live validation on blur
['fname', 'lname', 'email', 'phone', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id));
});

function showSuccess() {
  const successEl = document.getElementById('successMsg');
  const submitBtn = document.getElementById('submitBtn');
  if (successEl) {
    successEl.classList.add('show');
    if (submitBtn) {
      submitBtn.textContent = '✅ Message Sent!';
      submitBtn.disabled = true;
    }
    form.reset();
    setTimeout(() => {
      successEl.classList.remove('show');
      if (submitBtn) {
        submitBtn.innerHTML = '🚀 Send Message';
        submitBtn.disabled = false;
      }
    }, 5000);
  }
}

// ── INIT ──
showPage('home');
