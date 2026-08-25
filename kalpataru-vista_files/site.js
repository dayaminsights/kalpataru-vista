// site.js
document.addEventListener("DOMContentLoaded", function () {
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
