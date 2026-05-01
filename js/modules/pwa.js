import { dom } from "./dom.js";

let deferredPrompt = null;

export function initPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Ignore SW registration failures.
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (dom.installAppButton) dom.installAppButton.classList.remove("hidden");
  });

  dom.installAppButton?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    dom.installAppButton?.classList.add("hidden");
  });
}
