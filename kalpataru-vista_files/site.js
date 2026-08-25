// site.js
document.addEventListener("DOMContentLoaded", function () {
  initHeaderScrollState();
  initMobileNav();
  initScrollReveal();
});

function initScrollReveal() {
  const els = document.querySelectorAll('[data-anim="element"]');
  els.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
}

function initHeaderScrollState() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  });
}

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}
