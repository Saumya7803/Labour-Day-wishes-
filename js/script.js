/* ------------------------------
   Storage keys and constants
------------------------------ */
const MODE_KEY = "employee_appreciation_mode";
const THEME_KEY = "employee_appreciation_theme";
const MUSIC_KEY = "employee_appreciation_music";

const quotes = [
  "Hard work is the foundation of success.",
  "Every worker builds the future.",
  "Respect effort, respect people.",
  "Great teams are built by dedicated people.",
  "Effort today creates opportunity tomorrow."
];

/* ------------------------------
   Element references
------------------------------ */
const root = document.documentElement;
const wishCard = document.getElementById("wish-card");
const modeToggle = document.getElementById("mode-toggle");
const modeLabel = document.getElementById("mode-label");
const modeIcon = document.getElementById("mode-icon");
const themeButtons = document.querySelectorAll(".theme-btn");
const liveTime = document.getElementById("live-time");
const replayConfettiBtn = document.getElementById("confetti-replay");
const generateWishBtn = document.getElementById("generate-wish");
const employeeInput = document.getElementById("employee-name");
const companyInput = document.getElementById("company-name");
const companyLine = document.getElementById("company-line");
const personalLine = document.getElementById("personal-line");
const signoffLine = document.getElementById("signoff-line");
const quoteText = document.getElementById("quote-text");
const downloadBtn = document.getElementById("download-card");
const nativeShareBtn = document.getElementById("native-share");
const shareButtons = document.querySelectorAll(".btn-share");
const footerYear = document.getElementById("footer-year");
const musicToggle = document.getElementById("music-toggle");
const musicLabel = document.getElementById("music-label");
const musicElement = document.getElementById("bg-music");

let quoteIndex = 0;
let isMusicPlaying = false;

/* ------------------------------
   Theme and mode management
------------------------------ */
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === theme);
  });
}

function applyMode(mode) {
  root.setAttribute("data-mode", mode);
  localStorage.setItem(MODE_KEY, mode);

  if (mode === "dark") {
    modeLabel.textContent = "Light Mode";
    modeIcon.textContent = "SUN";
  } else {
    modeLabel.textContent = "Dark Mode";
    modeIcon.textContent = "MOON";
  }
}

function initializeThemeAndMode() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "corporate";
  const savedMode = localStorage.getItem(MODE_KEY) || "light";

  applyTheme(savedTheme);
  applyMode(savedMode);
}

/* ------------------------------
   Live date/time
------------------------------ */
function updateClock() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);

  liveTime.textContent = formatted;
  footerYear.textContent = `Our Office Employees | ${now.getFullYear()}`;
}

/* ------------------------------
   Wish personalization
------------------------------ */
function generateWish() {
  const employeeName = employeeInput.value.trim() || "Team";
  const companyName = companyInput.value.trim() || "Our Office Employees";

  companyLine.textContent = `Wishing all employees of ${companyName} success, health, and continued growth.`;
  personalLine.textContent = `Dear ${employeeName}, thank you for your dedication and professionalism.`;
  signoffLine.textContent = `With respect and gratitude, ${companyName} Leadership`;
}

/* ------------------------------
   Rotating quote section
------------------------------ */
function rotateQuote() {
  quoteText.classList.add("fade");

  setTimeout(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    quoteText.textContent = quotes[quoteIndex];
    quoteText.classList.remove("fade");
  }, 350);
}

/* ------------------------------
   Card download (PNG)
------------------------------ */
async function downloadCardAsImage() {
  if (typeof html2canvas === "undefined") {
    alert("Download feature is currently unavailable.");
    return;
  }

  downloadBtn.disabled = true;
  downloadBtn.textContent = "Preparing...";

  try {
    const canvas = await html2canvas(wishCard, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    });

    const link = document.createElement("a");
    link.download = "employee-appreciation-wish-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error(error);
    alert("Could not download the card. Please try again.");
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = "Download Card";
  }
}

/* ------------------------------
   Share functionality
------------------------------ */
function getSharePayload() {
  const text = `${companyLine.textContent} ${personalLine.textContent}`;
  return {
    title: "Office Employee Appreciation Wishes",
    text,
    url: window.location.href
  };
}

function getNetworkUrl(network, payload) {
  const encodedText = encodeURIComponent(`${payload.title} - ${payload.text}`);
  const encodedUrl = encodeURIComponent(payload.url);

  if (network === "whatsapp") {
    return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  }

  if (network === "linkedin") {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  }

  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
}

async function shareWithNetwork(network) {
  const payload = getSharePayload();

  if (navigator.share) {
    try {
      await navigator.share(payload);
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  const shareUrl = getNetworkUrl(network, payload);
  window.open(shareUrl, "_blank", "noopener,noreferrer");
}

/* ------------------------------
   Confetti celebration
------------------------------ */
function launchConfetti() {
  if (typeof confetti === "undefined") {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    return;
  }

  const end = Date.now() + 1400;
  const colors = ["#1655d1", "#ffd166", "#69d2e7", "#ffffff"];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      colors
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/* ------------------------------
   Optional background music
------------------------------ */
function updateMusicLabel() {
  musicLabel.textContent = isMusicPlaying ? "Pause Music" : "Play Music";
}

async function toggleMusic() {
  if (!musicElement) {
    return;
  }

  if (!isMusicPlaying) {
    try {
      await musicElement.play();
      isMusicPlaying = true;
      localStorage.setItem(MUSIC_KEY, "on");
    } catch (error) {
      console.error(error);
      alert("Unable to play music right now. You can add your own file in assets/soft-instrumental.mp3.");
    }
  } else {
    musicElement.pause();
    isMusicPlaying = false;
    localStorage.setItem(MUSIC_KEY, "off");
  }

  updateMusicLabel();
}

function initializeMusicState() {
  const saved = localStorage.getItem(MUSIC_KEY) || "off";
  isMusicPlaying = saved === "on";
  updateMusicLabel();
}

/* ------------------------------
   Typed heading animation
------------------------------ */
function initializeTyping() {
  if (typeof Typed === "undefined") {
    document.getElementById("typed-title").textContent = "Employee Appreciation Day";
    return;
  }

  new Typed("#typed-title", {
    strings: ["Employee Appreciation Day", "Honoring Every Employee", "Celebrating Hard Work"],
    typeSpeed: 52,
    backSpeed: 32,
    backDelay: 1400,
    startDelay: 200,
    loop: true,
    showCursor: true,
    cursorChar: "|"
  });
}

/* ------------------------------
   Event wiring and initialization
------------------------------ */
function init() {
  initializeThemeAndMode();
  initializeMusicState();
  initializeTyping();

  wishCard.classList.add("is-visible");

  updateClock();
  setInterval(updateClock, 1000);

  setTimeout(launchConfetti, 500);
  setInterval(rotateQuote, 5000);

  modeToggle.addEventListener("click", () => {
    const nextMode = root.getAttribute("data-mode") === "light" ? "dark" : "light";
    applyMode(nextMode);
  });

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.theme));
  });

  generateWishBtn.addEventListener("click", generateWish);
  replayConfettiBtn.addEventListener("click", launchConfetti);
  downloadBtn.addEventListener("click", downloadCardAsImage);
  musicToggle.addEventListener("click", toggleMusic);

  nativeShareBtn.addEventListener("click", async () => {
    const payload = getSharePayload();

    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch (error) {
        if (error.name !== "AbortError") {
          alert("Native sharing is not available in this browser.");
        }
      }
      return;
    }

    alert("Native sharing is not available. Use WhatsApp, LinkedIn, or Twitter buttons.");
  });

  shareButtons.forEach((button) => {
    button.addEventListener("click", () => shareWithNetwork(button.dataset.network));
  });
}

document.addEventListener("DOMContentLoaded", init);

