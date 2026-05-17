// Mobile navigation toggle
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

  // Quote / contact form handlers — client-side only acknowledgement
  document.querySelectorAll('form[data-handler="enquiry"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (form.querySelector('[name="name"]') || {}).value || 'there';
      const wrap = document.createElement('div');
      wrap.style.cssText = 'margin-top:14px;padding:14px 16px;background:#DCEEFB;border-radius:10px;color:#0E2A47;font-weight:600;';
      wrap.textContent = 'Thank you, ' + name + '. We\'ll be in touch within one working day.';
      form.appendChild(wrap);
      form.querySelector('button[type="submit"]').disabled = true;
    });
  });
})();
