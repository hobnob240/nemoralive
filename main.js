// ===============================
// Helper
// ===============================
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => scope.querySelectorAll(selector);

// ===============================
// Smooth scroll (if you use anchors)
// ===============================
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = $(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===============================
// Contact Form Logic
// ===============================
const form = $("#contactForm");

if (form) {

  const action = (form.getAttribute("action") || "").trim();
  const isFormspree = /https:\/\/formspree\.io\/f\//i.test(action);

  // ===============================
  // ✅ FORM SPREE HANDLING
  // ===============================
  if (isFormspree) {

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const status = $("#formStatus");
      if (status) status.textContent = "Sending...";

      const data = new FormData(form);

      try {
        const response = await fetch(action, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          form.reset();
          if (status) status.textContent = "✅ Message sent successfully. We’ll be in touch shortly.";
        } else {
          if (status) status.textContent = "❌ Something went wrong. Please try again.";
        }

      } catch (error) {
        if (status) status.textContent = "❌ Network error. Please try again.";
      }

    });

  }

  // ===============================
  // ⚠️ MAILTO FALLBACK (ONLY if NOT using Formspree)
  // ===============================
  else {

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      const email = (fd.get("email") || "").toString().trim();
      const company = (fd.get("company") || "").toString().trim();
      const message = (fd.get("message") || "").toString().trim();

      const subject = encodeURIComponent(
        `NEMORA enquiry${company ? " — " + company : ""}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}\n`
      );

      const to = form.dataset.to || "hello@nemora.agency";

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });

  }
}
