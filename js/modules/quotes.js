import { QUOTES, SLOGANS } from "./config.js";
import { dom } from "./dom.js";
import { state } from "./state.js";
import { getTranslation } from "./i18n.js";

let quoteIndex = 0;
let quoteTimer;

function listByLanguage(collection) {
  return collection[state.language] || collection.en;
}

function renderSlogans() {
  if (!dom.sloganTags) return;
  dom.sloganTags.innerHTML = "";
  listByLanguage(SLOGANS).forEach((slogan, idx) => {
    const tag = document.createElement("span");
    tag.className = "slogan-tag";
    tag.style.animationDelay = `${idx * 0.2}s`;
    tag.textContent = slogan;
    dom.sloganTags.appendChild(tag);
  });
}

function renderQuote(index) {
  const quotes = listByLanguage(QUOTES);
  const safeIndex = index % quotes.length;
  if (!dom.quoteText) return;
  dom.quoteText.classList.add("fade");
  setTimeout(() => {
    dom.quoteText.textContent = quotes[safeIndex];
    dom.quoteText.classList.remove("fade");
  }, 220);
}

function rotateQuote() {
  const quotes = listByLanguage(QUOTES);
  quoteIndex = (quoteIndex + 1) % quotes.length;
  renderQuote(quoteIndex);
}

async function copyQuote() {
  const text = dom.quoteText?.textContent || "";
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    if (dom.quoteCopyButton) {
      const original = getTranslation("copyQuote");
      dom.quoteCopyButton.textContent = getTranslation("copied");
      setTimeout(() => {
        dom.quoteCopyButton.textContent = original;
      }, 900);
    }
  } catch {
    // Ignore clipboard errors.
  }
}

export function initQuotes() {
  renderSlogans();
  quoteIndex = 0;
  renderQuote(quoteIndex);
  clearInterval(quoteTimer);
  quoteTimer = setInterval(rotateQuote, 5000);
  dom.quoteCopyButton?.addEventListener("click", copyQuote);

  window.addEventListener("languagechange", () => {
    renderSlogans();
    quoteIndex = 0;
    renderQuote(quoteIndex);
  });
}
