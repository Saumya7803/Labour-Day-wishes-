import { dom } from "./dom.js";
import { getTranslation } from "./i18n.js";
import { getCurrentWishText } from "./personalization.js";
import { state, updateState } from "./state.js";

function syncMusicLabel() {
  if (!dom.musicToggle) return;
  dom.musicToggle.textContent = state.musicEnabled ? getTranslation("pauseMusic") : getTranslation("playMusic");
}

async function toggleMusic() {
  if (!dom.bgMusic) return;

  if (!state.musicEnabled) {
    try {
      await dom.bgMusic.play();
      updateState("musicEnabled", true);
    } catch {
      alert("Music cannot play in this browser right now.");
    }
  } else {
    dom.bgMusic.pause();
    updateState("musicEnabled", false);
  }
  syncMusicLabel();
}

function speakWish() {
  const text = getCurrentWishText();
  if (!("speechSynthesis" in window) || !text) {
    alert("Speech is not supported in this browser.");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = state.language === "hi" ? "hi-IN" : "en-IN";
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
}

export function initSpeechAndMusic() {
  syncMusicLabel();
  dom.musicToggle?.addEventListener("click", toggleMusic);
  dom.speakWishButton?.addEventListener("click", speakWish);
  window.addEventListener("languagechange", syncMusicLabel);
}
