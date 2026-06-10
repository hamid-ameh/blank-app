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
