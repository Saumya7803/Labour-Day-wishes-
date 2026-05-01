import { DEFAULT_PROFILE, STORAGE_KEYS } from "./config.js";
import { getStoredValue, setStoredValue } from "./storage.js";

const initialAnalytics = { wishesGenerated: 0, downloads: 0 };

export const state = {
  mode: getStoredValue(STORAGE_KEYS.mode, "auto"),
  resolvedMode: "light",
  theme: getStoredValue(STORAGE_KEYS.theme, "corporate-blue"),
  template: getStoredValue(STORAGE_KEYS.template, "card"),
  language: getStoredValue(STORAGE_KEYS.language, "en"),
  profile: getStoredValue(STORAGE_KEYS.profile, DEFAULT_PROFILE),
  analytics: getStoredValue(STORAGE_KEYS.analytics, initialAnalytics),
  musicEnabled: getStoredValue(STORAGE_KEYS.music, false),
};

export function updateState(key, value) {
  state[key] = value;
  if (key === "mode") setStoredValue(STORAGE_KEYS.mode, value);
  if (key === "theme") setStoredValue(STORAGE_KEYS.theme, value);
  if (key === "template") setStoredValue(STORAGE_KEYS.template, value);
  if (key === "language") setStoredValue(STORAGE_KEYS.language, value);
  if (key === "profile") setStoredValue(STORAGE_KEYS.profile, value);
  if (key === "musicEnabled") setStoredValue(STORAGE_KEYS.music, value);
  if (key === "analytics") setStoredValue(STORAGE_KEYS.analytics, value);
}
