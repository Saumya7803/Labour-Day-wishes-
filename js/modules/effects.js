import { dom } from "./dom.js";

export function initTypedHeading() {
  if (typeof Typed === "undefined" || !dom.typedTitle) {
    if (dom.typedTitle) dom.typedTitle.textContent = "International Workers Day Wishes";
    return;
  }

  new Typed("#typed-title", {
    strings: ["International Workers Day Wishes", "Honoring Every Worker", "Professional Employee Appreciation"],
    typeSpeed: 52,
    backSpeed: 30,
    backDelay: 1300,
    loop: true,
    showCursor: true,
    cursorChar: "|",
  });
}

export function revealCard() {
  dom.wishCard?.classList.add("visible");
}

export function launchConfetti() {
  if (typeof confetti === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const end = Date.now() + 1500;
  const colors = ["#1655d1", "#ffd166", "#69d5eb", "#ffffff"];

  (function frame() {
    confetti({
      particleCount: 3,
      spread: 70,
      angle: 60,
      origin: { x: 0 },
      colors,
    });

    confetti({
      particleCount: 3,
      spread: 70,
      angle: 120,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function burstAtElement(element) {
  if (typeof confetti === "undefined" || !element) return;
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  confetti({ particleCount: 80, spread: 85, origin: { x, y } });
}

export function initRipple() {
  document.querySelectorAll("[data-ripple]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      circle.style.width = `${diameter}px`;
      circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
      circle.className = "ripple";
      const ripple = button.getElementsByClassName("ripple")[0];
      if (ripple) ripple.remove();
      button.appendChild(circle);
    });
  });
}
