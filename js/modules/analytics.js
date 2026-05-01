import { dom } from "./dom.js";
import { state, updateState } from "./state.js";

function renderAnalytics() {
  if (dom.wishCount) dom.wishCount.textContent = String(state.analytics.wishesGenerated);
  if (dom.downloadCount) dom.downloadCount.textContent = String(state.analytics.downloads);
}

export function incrementWishes() {
  const next = {
    ...state.analytics,
    wishesGenerated: state.analytics.wishesGenerated + 1,
  };
  updateState("analytics", next);
  renderAnalytics();
}

export function incrementDownloads() {
  const next = {
    ...state.analytics,
    downloads: state.analytics.downloads + 1,
  };
  updateState("analytics", next);
  renderAnalytics();
}

export function initAnalytics() {
  renderAnalytics();
}
