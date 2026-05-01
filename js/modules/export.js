import { incrementDownloads } from "./analytics.js";
import { dom } from "./dom.js";

async function captureCard(scale = 2) {
  if (typeof html2canvas === "undefined" || !dom.wishCard) {
    throw new Error("html2canvas is unavailable.");
  }

  return html2canvas(dom.wishCard, {
    scale,
    useCORS: true,
    backgroundColor: null,
    scrollX: 0,
    scrollY: 0,
  });
}

function triggerDownload(name, url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
}

async function downloadImage() {
  if (!dom.downloadImageButton) return;
  const originalText = dom.downloadImageButton.textContent;
  dom.downloadImageButton.disabled = true;
  dom.downloadImageButton.textContent = "Preparing...";

  try {
    const canvas = await captureCard(Math.max(2, window.devicePixelRatio));
    triggerDownload("international-workers-day-wish.png", canvas.toDataURL("image/png", 1));
    incrementDownloads();
  } catch {
    alert("Image export failed. Please try again.");
  } finally {
    dom.downloadImageButton.disabled = false;
    if (originalText) dom.downloadImageButton.textContent = originalText;
  }
}

async function downloadMiniFrames() {
  if (!dom.downloadMiniVideoButton) return;
  const originalText = dom.downloadMiniVideoButton.textContent;
  dom.downloadMiniVideoButton.disabled = true;
  dom.downloadMiniVideoButton.textContent = "Capturing...";

  try {
    for (let i = 0; i < 4; i += 1) {
      dom.wishCard?.style.setProperty("transform", `translateY(${Math.sin(i * 1.4) * 3}px)`);
      const canvas = await captureCard(1.5);
      triggerDownload(`workers-day-frame-${i + 1}.png`, canvas.toDataURL("image/png"));
      await new Promise((resolve) => setTimeout(resolve, 220));
    }
    dom.wishCard?.style.removeProperty("transform");
    incrementDownloads();
  } catch {
    alert("Mini frame export failed.");
  } finally {
    dom.downloadMiniVideoButton.disabled = false;
    if (originalText) dom.downloadMiniVideoButton.textContent = originalText;
  }
}

export function initExport() {
  dom.downloadImageButton?.addEventListener("click", downloadImage);
  dom.downloadMiniVideoButton?.addEventListener("click", downloadMiniFrames);
}
