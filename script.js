/**
 * ABDUS SAMAD — PORTFOLIO CLIENT LOGIC
 * Dynamic Theme, Lightbox, Copy System, & Real Contact Dispatch
 */

document.addEventListener('DOMContentLoaded', () => {
  // ─── 0. Dynamic Copyright Year ─────────────────────────────────────────
  const copyrightEl = document.getElementById('copyrightYear');
  if (copyrightEl) {
    const currentYear = new Date().getFullYear();
    copyrightEl.textContent = `© ${currentYear} Abdus Samad. All rights reserved.`;
  }

  // ─── 1. Custom Smooth Magnetic Cursor ──────────────────────────────────
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let isCursorVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isCursorVisible) {
      isCursorVisible = true;
      document.body.classList.add('cursor-active');
    }

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states for cursor
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .avatar-card, .stack-card, .project-card, .zoomable-img');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor?.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor?.classList.remove('hovered'));
  });

  // ─── 2. Functional Theme Toggle (Cream <-> Dark) ────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('samad_portfolio_theme') || 'cream';
  document.body.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'cream' : 'dark';
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('samad_portfolio_theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Obsidian Dark' : 'Warm Cream'} mode`);
  });

  // ─── 3. Mobile Navigation Menu ─────────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('open');
    mobileMenu?.setAttribute('aria-hidden', (!isOpen).toString());
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
      mobileMenu?.setAttribute('aria-hidden', 'true');
    });
  });

  document.addEventListener('click', (e) => {
    if (mobileMenu?.classList.contains('open') && !mobileMenu.contains(e.target) && !menuToggle?.contains(e.target)) {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // ─── 4. Active Navigation Link Spy & Smooth Scroll ─────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links-desktop .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 160;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ─── 5. Lightbox Modal for High-Resolution Previews ────────────────────
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(src, altText) {
    if (lightboxImg && lightboxModal) {
      lightboxImg.src = src;
      lightboxImg.alt = altText || '';
      if (lightboxCaption) lightboxCaption.textContent = altText || '';
      lightboxModal.classList.add('open');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  document.getElementById('avatarCard')?.addEventListener('click', () => {
    const img = document.getElementById('avatarImg');
    if (img) openLightbox(img.src, 'Abdus Samad — Software Developer Portrait');
  });

  document.querySelectorAll('.zoomable-img').forEach((img) => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('open')) {
      closeLightbox();
    }
  });

  // ─── 6. Toast Notification Helper ──────────────────────────────────────
  const toast = document.getElementById('toastPopup');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3500);
  }

  // Copy phone number on click
  document.querySelectorAll('.copy-phone-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const phone = btn.getAttribute('data-phone') || '+919608121613';
      navigator.clipboard.writeText(phone).then(() => {
        showToast('✓ Phone number copied: +91 96081 21613');
      }).catch(() => {
        window.location.href = `tel:${phone}`;
      });
    });
  });

  // ─── 7. Back to Top ────────────────────────────────────────────────────
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── 8. REAL CONTACT FORM DISPATCH (Target: abdussamad5826@gmail.com) ──
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnText = document.getElementById('btnText');
  const successToast = document.getElementById('formToastSuccess');
  const errorToast = document.getElementById('formToastError');

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const projectInput = document.getElementById('contactProject');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const projectError = document.getElementById('projectError');

  let isSubmitting = false;

  function clearErrors() {
    [nameInput, emailInput, projectInput].forEach(inp => inp?.classList.remove('invalid'));
    [nameError, emailError, projectError].forEach(err => {
      if (err) {
        err.style.display = 'none';
        err.textContent = '';
      }
    });
    if (successToast) successToast.style.display = 'none';
    if (errorToast) errorToast.style.display = 'none';
  }

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    clearErrors();

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const project = projectInput?.value.trim();

    let hasError = false;

    // Field 1: Name
    if (!name) {
      nameInput?.classList.add('invalid');
      if (nameError) {
        nameError.textContent = 'Please enter your name or company.';
        nameError.style.display = 'block';
      }
      hasError = true;
    }

    // Field 2: Email or Phone
    if (!email) {
      emailInput?.classList.add('invalid');
      if (emailError) {
        emailError.textContent = 'Please provide an email address or phone number.';
        emailError.style.display = 'block';
      }
      hasError = true;
    } else if (email.includes('@')) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        emailInput?.classList.add('invalid');
        if (emailError) {
          emailError.textContent = 'Please enter a valid email format (e.g. name@domain.com).';
          emailError.style.display = 'block';
        }
        hasError = true;
      }
    }

    // Field 3: Project message
    if (!project || project.length < 5) {
      projectInput?.classList.add('invalid');
      if (projectError) {
        projectError.textContent = 'Please provide a brief description of your project requirements.';
        projectError.style.display = 'block';
      }
      hasError = true;
    }

    if (hasError) return;

    // Begin Submission State
    isSubmitting = true;
    if (submitBtn) submitBtn.disabled = true;
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (btnText) btnText.textContent = 'Sending...';

    const payload = { name, email, project, targetRecipient: 'abdussamad5826@gmail.com' };

    // Check if EmailJS is configured with non-placeholder keys
    const cfg = window.EMAILJS_CONFIG || {};
    const hasEmailJSConfigured = (
      cfg.SERVICE_ID && cfg.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
      cfg.TEMPLATE_ID && cfg.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
      cfg.PUBLIC_KEY && cfg.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
    );

    let sentSuccessfully = false;
    let responseMessage = '';

    if (hasEmailJSConfigured && window.emailjs) {
      try {
        emailjs.init(cfg.PUBLIC_KEY);
        const res = await emailjs.send(cfg.SERVICE_ID, cfg.TEMPLATE_ID, {
          from_name: name,
          reply_to: email,
          message: project,
          to_email: 'abdussamad5826@gmail.com'
        });
        if (res.status === 200) {
          sentSuccessfully = true;
          responseMessage = 'Inquiry sent directly to abdussamad5826@gmail.com via EmailJS.';
        }
      } catch (emailJsErr) {
        console.warn('EmailJS attempt failed, falling back to server API:', emailJsErr);
      }
    }

    // If EmailJS was not configured or errored, send to local server endpoint
    if (!sentSuccessfully) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok && result.success) {
          sentSuccessfully = true;
          responseMessage = result.delivered
            ? 'Inquiry dispatched to abdussamad5826@gmail.com.'
            : 'Inquiry received and logged to inquiries.json. (To enable live SMTP delivery, provide EmailJS or Resend keys as detailed in README.md).';
        } else {
          throw new Error(result.error || 'Server error');
        }
      } catch (serverErr) {
        console.error('Submission error:', serverErr);
        sentSuccessfully = false;
      }
    }

    // Reset Submission State
    isSubmitting = false;
    if (submitBtn) submitBtn.disabled = false;
    if (btnSpinner) btnSpinner.style.display = 'none';
    if (btnText) btnText.textContent = 'Send Message';

    if (sentSuccessfully) {
      contactForm.reset();
      if (successToast) {
        successToast.innerHTML = `✓ Message received! Your inquiry has been processed for <strong>abdussamad5826@gmail.com</strong>.<br><small style="opacity:0.85">${responseMessage}</small>`;
        successToast.style.display = 'block';
      }
      showToast('✓ Inquiry submitted successfully!');
    } else {
      if (errorToast) {
        errorToast.style.display = 'block';
        errorToast.textContent = '⚠️ Unable to deliver message right now. Please call or message on WhatsApp directly.';
      }
      showToast('⚠️ Submission failed. Please try again or reach out on WhatsApp.');
    }
  });
});
