import { dom } from "./dom.js";
import { getCurrentWishText } from "./personalization.js";

function payload() {
  return {
    title: "International Workers Day Wishes",
    text: getCurrentWishText(),
    url: window.location.href,
  };
}

function networkUrl(network) {
  const p = payload();
  const text = encodeURIComponent(`${p.title}: ${p.text}`);
  const url = encodeURIComponent(p.url);

  if (network === "whatsapp") return `https://wa.me/?text=${text}%20${url}`;
  if (network === "linkedin") return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

export function initShare() {
  dom.nativeShareButton?.addEventListener("click", async () => {
    if (!navigator.share) {
      window.open(networkUrl("twitter"), "_blank", "noopener,noreferrer");
      return;
    }
    try {
      await navigator.share(payload());
    } catch {
      // user cancelled
    }
  });

  dom.shareButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const network = button.dataset.network;
      if (!network) return;

      if (navigator.share) {
        try {
          await navigator.share(payload());
          return;
        } catch {
          // fallback
        }
      }

      window.open(networkUrl(network), "_blank", "noopener,noreferrer");
    });
  });
}
