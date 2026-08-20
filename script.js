/* =========================================================
   QBH Media — script.js
   Mobile menu, sticky nav shadow, smooth-scroll close,
   and front-end contact form validation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('mobile-menu');

  function closeMenu() {
    menu.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    menu.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  toggle.addEventListener('click', function () {
    var isOpen = menu.getAttribute('data-open') === 'true';
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Close mobile menu if window is resized back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeMenu();
  });

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  var validators = {
    name: function (v) {
      return v.trim().length >= 2 ? '' : 'Please enter your name.';
    },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    channel: function (v) {
      if (!v.trim()) return 'Please enter your YouTube channel URL.';
      try {
        var url = new URL(v.trim());
        return /youtube\.com|youtu\.be/i.test(url.hostname) ? '' : 'Please enter a valid YouTube URL.';
      } catch (err) {
        return 'Please enter a valid URL (e.g. https://youtube.com/@yourchannel).';
      }
    },
    service: function (v) {
      return v ? '' : 'Please select a service.';
    },
    message: function (v) {
      return v.trim().length >= 10 ? '' : 'Please enter a short message (at least 10 characters).';
    }
  };

  function showError(fieldName, message) {
    var field = document.getElementById(fieldName);
    var errorEl = document.getElementById('err-' + fieldName);
    var row = field.closest('.form-row');
    if (message) {
      row.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      row.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function validateField(fieldName) {
    var field = document.getElementById(fieldName);
    var message = validators[fieldName](field.value);
    showError(fieldName, message);
    return message === '';
  }

  Object.keys(validators).forEach(function (fieldName) {
    var field = document.getElementById(fieldName);
    field.addEventListener('blur', function () { validateField(fieldName); });
    field.addEventListener('input', function () {
      var row = field.closest('.form-row');
      if (row.classList.contains('invalid')) validateField(fieldName);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var allValid = true;
    Object.keys(validators).forEach(function (fieldName) {
      var valid = validateField(fieldName);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields above.';
      status.classList.remove('success');
      return;
    }

    // No backend/email service is connected yet.
    // This is where a form submission API (e.g. Formspree, EmailJS,
    // or a custom backend endpoint) should be wired in.
    status.textContent = 'Thanks — your details look good. This demo form isn\'t connected to an email service yet, so please send your request directly to qbh313official@gmail.com for now.';
    status.classList.remove('success');
  });

  /* ---------- Reveal-on-scroll for cards ---------- */
  var revealTargets = document.querySelectorAll('.feature-card, .service-card, .process-card, .about__panel');

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }
});
