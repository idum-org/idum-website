/**
 * IDUM Website — script.js
 * All client-side behavior for index.html. No build step, no dependencies
 * beyond Lucide (loaded via CDN in index.html <head>).
 *
 * WHAT THIS FILE DOES:
 *   1. Initializes Lucide icons (converts data-lucide attributes to SVGs)
 *   2. Toggles nav bar appearance on scroll (dark <-> white)
 *   3. Manages the 6-tab dynamic contact form (tab switching, field visibility)
 *   4. Submits the form to Web3Forms (hosted email service) and shows
 *      loading / success / error states
 *
 * CROSS-FILE REFERENCES:
 *   - Nav: adds/removes .scrolled class on <nav id="nav"> — styled in styles.css
 *   - Form tabs: data-tab attributes in index.html must match tabMeta keys below
 *   - Form fields: #field-location and #field-timeframe are shown/hidden per tab
 *   - Form submit: POSTs JSON to Web3Forms; on success #form-success shows for
 *     6 seconds, then the form resets; on failure #form-error shows
 *   - lucide.createIcons() is called after any innerHTML change that adds
 *     data-lucide attributes (e.g., submit button icon replacement)
 */

// Initialize all Lucide icons on page load
lucide.createIcons();

// ── Contact form backend (Web3Forms) ────────────────────────────────────
// Submissions are emailed to oceanbombhunters@gmail.com via Web3Forms — a free,
// hosted form-to-email service. No server to run or maintain.
//
// SETUP (one time): go to https://web3forms.com, enter oceanbombhunters@gmail.com,
// and it emails a free Access Key. Paste that key below. That's it — nothing else
// to deploy. View submissions / change settings at https://web3forms.com (dashboard).
var WEB3FORMS_ACCESS_KEY = '0c12fd49-15cf-45e3-aa8e-f2e0237bce18';
var CONTACT_ENDPOINT = 'https://api.web3forms.com/submit';

// ── Nav scroll behavior ─────────────────────────────────────────────────
// Adds .scrolled class to nav when page is scrolled past 100px.
// This triggers the dark-to-white nav transition defined in styles.css.
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ── Contact form tab configuration ──────────────────────────────────────
// Each key corresponds to a data-tab attribute on .contact-tab buttons in index.html.
// Properties control what the form displays when that tab is active:
//   title    — text for #form-dynamic-title
//   subtitle — text for #form-dynamic-subtitle
//   btn      — submit button label (arrow icon appended automatically)
//   loc      — whether to show the #field-location input
//   time     — whether to show the #field-timeframe select
//   type     — inquiry label for the email subject ("IDUM - {type} Inquiry")
var tabMeta = {
  support:      { title: 'Support UN Ocean Action: #21356', subtitle: 'Thanks for your support. Contact us below to partner, donate or share how you\'d like to support this UN initiative.', btn: 'Submit Support Inquiry', loc: false, time: false, type: 'Support' },
  consulting:   { title: 'Expert Consultation Request',    subtitle: 'For government, military, or industry consultation on underwater munitions.',       btn: 'Submit Consultation Request', loc: true,  time: true,  type: 'Consulting'   },
  speaking:     { title: 'Speaking Engagement Inquiry',    subtitle: 'Book Terrance for international keynotes, panels, or conference presentations.',     btn: 'Submit Speaking Inquiry',     loc: false, time: true,  type: 'Speaking'     },
  media:        { title: 'Media Collaboration Inquiry',    subtitle: 'For documentary, journalism, or broadcast collaboration requests.',                   btn: 'Submit Media Inquiry',        loc: false, time: false, type: 'Media'        },
  data:         { title: 'Data Access Request',            subtitle: 'Request access to the world\'s most comprehensive underwater munitions database.',    btn: 'Submit Data Request',         loc: true,  time: true,  type: 'Data Access'  },
  partnerships: { title: 'Partnership Inquiry',            subtitle: 'For organizations seeking to collaborate with IDUM on ocean munitions initiatives.',  btn: 'Submit Partnership Inquiry',  loc: false, time: false, type: 'Partnerships' }
};

/**
 * switchTab — Updates the contact form to match the selected tab.
 * Called via onclick on .contact-tab buttons in index.html.
 * @param {HTMLElement} el - The clicked tab button element
 * @param {string} tab - Key from tabMeta (e.g., 'consulting', 'speaking')
 */
function switchTab(el, tab) {
  document.querySelectorAll('.contact-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  var m = tabMeta[tab];
  document.getElementById('form-dynamic-title').textContent = m.title;
  document.getElementById('form-dynamic-subtitle').textContent = m.subtitle;
  document.getElementById('form-submit-btn').innerHTML = m.btn + ' <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>';
  document.getElementById('field-location').style.display = m.loc ? '' : 'none';
  document.getElementById('field-timeframe').style.display = m.time ? '' : 'none';
  // Record the inquiry type so it lands in the email subject/body
  document.getElementById('field-inquiry-type').value = m.type;
  // Re-initialize icons because the submit button innerHTML was replaced
  lucide.createIcons();
}

/**
 * scrollToContact — Smooth-scrolls to the contact form section.
 * Used by CTA buttons throughout the page.
 */
function scrollToContact() {
  document.getElementById('contact-form-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * openContact — Scrolls to the contact form and activates a specific tab.
 * Used by service card buttons (e.g., "Book as Speaker" -> openContact('speaking')).
 * The 400ms delay allows the scroll animation to complete before switching tabs.
 * @param {string} tab - Key from tabMeta to activate
 */
function openContact(tab) {
  document.getElementById('contact-form-section').scrollIntoView({ behavior: 'smooth' });
  setTimeout(function() {
    var btn = document.querySelector('.contact-tab[data-tab="' + tab + '"]');
    if (btn) switchTab(btn, tab);
  }, 400);
}

/**
 * handleSubmit — Posts the form to Web3Forms, which emails oceanbombhunters@gmail.com.
 * Shows a loading state, then success or an inline error (no data is lost on
 * failure — the user can retry). Called via onsubmit on #contact-form.
 */
function handleSubmit(e) {
  e.preventDefault();
  var form = document.getElementById('contact-form');
  var btn = document.getElementById('form-submit-btn');
  var errorEl = document.getElementById('form-error');

  // Native validation (form has novalidate so we trigger it explicitly)
  if (!form.checkValidity()) { form.reportValidity(); return; }

  // Reset any prior error, enter loading state
  errorEl.classList.remove('visible');
  var originalBtn = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Sending…';

  var payload = Object.fromEntries(new FormData(form).entries());
  // Web3Forms fields: access_key authenticates; subject sets the email subject
  // line ("IDUM - Consulting Inquiry", etc.); from_name labels the sender.
  payload.access_key = WEB3FORMS_ACCESS_KEY;
  payload.subject = 'IDUM - ' + (payload.inquiry_type || 'General') + ' Inquiry';
  payload.from_name = 'IDUM Website Contact Form';

  fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(function(res) {
      if (!res.ok) throw new Error('Request failed (' + res.status + ')');
      return res.json().catch(function() { return {}; });
    })
    .then(function() {
      // Success: swap form for the thank-you message
      form.style.display = 'none';
      document.getElementById('form-title-wrap').style.display = 'none';
      var s = document.getElementById('form-success');
      s.style.display = 'block';
      lucide.createIcons();
      setTimeout(function() {
        form.reset();
        btn.innerHTML = originalBtn;
        btn.disabled = false;
        form.style.display = '';
        document.getElementById('form-title-wrap').style.display = '';
        s.style.display = 'none';
        lucide.createIcons();
      }, 6000);
    })
    .catch(function() {
      // Failure: restore the button and show a recoverable error
      btn.innerHTML = originalBtn;
      btn.disabled = false;
      lucide.createIcons();
      errorEl.textContent = 'Sorry — your inquiry could not be sent. Please try again, or email oceanbombhunters@gmail.com directly.';
      errorEl.classList.add('visible');
    });
}
