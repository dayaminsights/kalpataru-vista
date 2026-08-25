// site.js
document.addEventListener("DOMContentLoaded", function () {
  initHeaderScrollState();
  initMobileNav();
  initHeroSlideshow();
  initSiteVisitForm();
  initScrollReveal();
  initSpecTabs();
});

function initScrollReveal() {
  const els = document.querySelectorAll('[data-anim="element"]');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapReady = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (reduceMotion || !gsapReady) {
    els.forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }
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
  const syncScrollState = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  syncScrollState();
  window.addEventListener("scroll", syncScrollState);
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

function initHeroSlideshow() {
  const slides = document.querySelectorAll("#heroSlides .hero__slide");
  if (slides.length < 2) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove("is-active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("is-active");
  }, 5000);
}

function initSpecTabs() {
  const tabs = document.querySelectorAll(".specs__tab");
  const panels = document.querySelectorAll(".specs__panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.querySelector(`.specs__panel[data-panel="${tab.dataset.tab}"]`).classList.add("is-active");
    });
  });
}

function initSiteVisitForm() {
  const form = document.getElementById("siteVisitForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // NOTE: keep this tag list in sync with any new form-control types added to #siteVisitForm (e.g. <select>)
    form.querySelectorAll("input, textarea, button").forEach((el) => (el.hidden = true));
    form.querySelector(".hero__form-success").hidden = false;
  });
}
