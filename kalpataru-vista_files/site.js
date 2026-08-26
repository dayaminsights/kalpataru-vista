// site.js
document.addEventListener("DOMContentLoaded", function () {
  initHeaderScrollState();
  initMobileNav();
  initHeroSlideshow();
  initHeroSequence();
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

function initHeroSequence() {
  const canvas = document.getElementById("heroSequence");
  if (!canvas) return;
  const gsapReady = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (!gsapReady) return;

  const ctx = canvas.getContext("2d");
  const frameCount = 428;
  const lookAhead = 8;
  const framePath = (i) => `assets/hero-src/apartment-sequence/frame-${String(i).padStart(3, "0")}.webp`;

  const frames = new Map();
  let targetIndex = 1;
  let direction = 1;
  let lastPaintedIndex = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
  }

  function paint(index) {
    const img = frames.get(index);
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    lastPaintedIndex = index;
  }

  function requestFrame(index) {
    if (frames.has(index)) return;
    const img = new Image();
    img.onload = () => {
      if (index === targetIndex) paint(index);
    };
    img.src = framePath(index);
    frames.set(index, img);
  }

  function drawFrame(index) {
    const clamped = Math.min(Math.max(index, 1), frameCount);
    direction = clamped >= targetIndex ? 1 : -1;
    targetIndex = clamped;
    requestFrame(clamped);
    for (let step = 1; step <= lookAhead; step += 1) {
      const aheadIndex = clamped + step * direction;
      if (aheadIndex >= 1 && aheadIndex <= frameCount) requestFrame(aheadIndex);
    }
    paint(clamped);
  }

  gsap.matchMedia().add("(min-width: 992px)", () => {
    resizeCanvas();
    drawFrame(1);

    const onResize = () => {
      resizeCanvas();
      if (lastPaintedIndex !== null) paint(lastPaintedIndex);
    };
    window.addEventListener("resize", onResize);

    const st = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "+=400%",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        drawFrame(Math.round(self.progress * (frameCount - 1)) + 1);
      },
    });

    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  });
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
