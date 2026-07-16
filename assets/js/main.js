// =============================================================
// Amvisphere — site JS
// =============================================================

// ---- 1. Formspree endpoint ---------------------------------
//
// Replace this with your real Formspree URL once you have one.
// Get yours at https://formspree.io — sign up with
// info@amvisphereltd.co.uk and create a new form. It will look
// like: https://formspree.io/f/xyzabcde
//
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeewzqdw';

// ---- 2. Mobile navigation toggle ---------------------------
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Mark current nav link as active based on pathname
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
})();

// ---- 3. Enquiry form handler -------------------------------
(function () {
  function showMessage(form, text, kind) {
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();
    const wrap = document.createElement('div');
    wrap.className = 'form-message';
    const okStyle = 'background:#DCEEFB;color:#0E2A47;';
    const errStyle = 'background:#FFE9E3;color:#C24A2A;';
    wrap.setAttribute('style',
      'margin-top:14px;padding:14px 16px;border-radius:10px;font-weight:600;' +
      (kind === 'error' ? errStyle : okStyle)
    );
    wrap.textContent = text;
    form.appendChild(wrap);
  }

  document.querySelectorAll('form[data-handler="enquiry"]').forEach(function (form) {
    // If the form has no action attribute, default to the central endpoint
    if (!form.getAttribute('action')) {
      form.setAttribute('action', FORMSPREE_ENDPOINT);
      form.setAttribute('method', 'POST');
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalLabel = btn ? btn.textContent : '';
      const action = form.getAttribute('action') || '';

      // Guard: don't try to POST if the placeholder is still in place
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        showMessage(
          form,
          "Thanks — but our enquiry form isn't connected yet. Please call 07498 895296 or email info@amvisphereltd.co.uk.",
          'error'
        );
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          const nameInput = form.querySelector('[name="name"]');
          const name = (nameInput && nameInput.value) ? nameInput.value : 'there';
          showMessage(
            form,
            'Thank you, ' + name + ". We'll be in touch within one working day.",
            'success'
          );
          form.reset();
          if (btn) btn.textContent = 'Sent ✓';
        } else {
          showMessage(
            form,
            "Something went wrong sending your enquiry. Please call 07498 895296 or email info@amvisphereltd.co.uk.",
            'error'
          );
          if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
        }
      } catch (err) {
        showMessage(
          form,
          "Network problem — your enquiry didn't send. Please call 07498 895296.",
          'error'
        );
        if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
      }
    });
  });
})();

// ---- 4. Hero slider ----------------------------------------
(function () {
  const slider = document.querySelector('.slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.slider-dot');
  let current = 0, timer = null;

  function go(i) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }
  function start() { timer = setInterval(function () { go(current + 1); }, 6000); }
  function reset() { clearInterval(timer); start(); }

  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); reset(); }); });
  const prev = slider.querySelector('.slider-arrow.prev');
  const next = slider.querySelector('.slider-arrow.next');
  if (prev) prev.addEventListener('click', function () { go(current - 1); reset(); });
  if (next) next.addEventListener('click', function () { go(current + 1); reset(); });
  slider.addEventListener('mouseenter', function () { clearInterval(timer); });
  slider.addEventListener('mouseleave', start);
  start();
})();

// ---- 5. Mobile dropdown toggle ------------------------------
(function () {
  document.querySelectorAll('.nav-item > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 720) {
        const item = link.parentElement;
        if (!item.classList.contains('open')) {
          e.preventDefault();
          item.classList.add('open');
        }
      }
    });
  });
})();

// ---- 6. Scroll reveal ---------------------------------------
(function () {
  const targets = document.querySelectorAll(
    '.section-head, .service-tile, .service-photo-card, .step, .pricing-card, ' +
    '.testimonial, .trust-card, .value, .sector, .split > *, .service-block, ' +
    '.contact-info, .contact-form, .cta-band'
  );
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach(function (t) { t.classList.add('reveal'); io.observe(t); });
})();

// ---- 7. Animated counters -----------------------------------
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = (String(target).split('.')[1] || '').length;
      const dur = 1400, t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.4 });
  counters.forEach(function (c) { io.observe(c); });
})();

// ---- 8. Floating actions ------------------------------------
(function () {
  const wrap = document.createElement('div');
  wrap.className = 'float-actions';
  wrap.innerHTML =
    '<a class="float-btn float-call" href="tel:+447498895296" aria-label="Call Amvisphere">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></a>' +
    '<button class="float-btn float-top" aria-label="Back to top">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>';
  document.body.appendChild(wrap);
  const topBtn = wrap.querySelector('.float-top');
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', function () {
    topBtn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
})();
