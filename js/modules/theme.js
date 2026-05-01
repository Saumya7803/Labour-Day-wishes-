import { dom } from "./dom.js";
import { state, updateState } from "./state.js";

const MODES = ["auto", "light", "dark"];

function detectSystemMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveMode(mode) {
  if (mode === "auto") return detectSystemMode();
  return mode;
}

function updateModeLabel() {
  const modeLabel = state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
  if (dom.modePillText) dom.modePillText.textContent = `Mode: ${modeLabel}`;
}

function applyMode(mode) {
  const resolved = resolveMode(mode);
  updateState("resolvedMode", resolved);
  dom.html.setAttribute("data-mode", mode);
  dom.html.setAttribute("data-resolved-mode", resolved);
  updateModeLabel();
}

function applyTheme(theme) {
  updateState("theme", theme);
  dom.html.setAttribute("data-theme", theme);
  dom.themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === theme);
  });
}

function applyTemplate(template) {
  updateState("template", template);
  dom.html.setAttribute("data-template", template);
  dom.templateButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.templateSwitch === template);
  });
}

export function initThemeSystem() {
  applyMode(state.mode);
  applyTheme(state.theme);
  applyTemplate(state.template);

  dom.modeToggle?.addEventListener("click", () => {
    const index = MODES.indexOf(state.mode);
    const nextMode = MODES[(index + 1) % MODES.length];
    updateState("mode", nextMode);
    applyMode(nextMode);
  });

  dom.themeButtons.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.theme));
  });

  dom.templateButtons.forEach((button) => {
    button.addEventListener("click", () => applyTemplate(button.dataset.templateSwitch));
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (state.mode === "auto") applyMode("auto");
  });
}
