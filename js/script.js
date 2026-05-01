import { dom } from "./modules/dom.js";
import { initThemeSystem } from "./modules/theme.js";
import { initTime } from "./modules/time.js";
import { initTypedHeading, initRipple, revealCard, launchConfetti, burstAtElement } from "./modules/effects.js";
import { initI18n } from "./modules/i18n.js";
import { initPersonalization } from "./modules/personalization.js";
import { initQuotes } from "./modules/quotes.js";
import { initAnalytics } from "./modules/analytics.js";
import { initShare } from "./modules/share.js";
import { initExport } from "./modules/export.js";
import { initSpeechAndMusic } from "./modules/speech-music.js";
import { initPWA } from "./modules/pwa.js";

function init() {
  if (!dom.appRoot) return;

  initI18n();
  initThemeSystem();
  initTime();
  initTypedHeading();
  initRipple();
  revealCard();
  initAnalytics();
  initPersonalization({ onGenerate: () => burstAtElement(dom.generateWishButton) });
  initQuotes();
  initShare();
  initExport();
  initSpeechAndMusic();
  initPWA();

  setTimeout(() => launchConfetti(), 500);
  dom.replayConfettiButton?.addEventListener("click", launchConfetti);
}

document.addEventListener("DOMContentLoaded", init);
