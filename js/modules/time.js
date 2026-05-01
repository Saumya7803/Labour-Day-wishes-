import { dom } from "./dom.js";
import { state } from "./state.js";

export function initTime() {
  const render = () => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat(state.language === "hi" ? "hi-IN" : "en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(now);

    if (dom.liveDateTime) dom.liveDateTime.textContent = formatted;
    if (dom.footerYear) dom.footerYear.textContent = `International Workers Day Wishes | ${now.getFullYear()}`;
  };

  render();
  setInterval(render, 1000);
  window.addEventListener("languagechange", render);
}
