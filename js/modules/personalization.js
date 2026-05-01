import { DEFAULT_PROFILE, MESSAGE_TEMPLATES } from "./config.js";
import { incrementWishes } from "./analytics.js";
import { dom } from "./dom.js";
import { state, updateState } from "./state.js";

function randomTemplate(tone, lang) {
  const variants = MESSAGE_TEMPLATES[tone]?.[lang] || MESSAGE_TEMPLATES.formal.en;
  return variants[Math.floor(Math.random() * variants.length)];
}

function greetingByLanguage(lang, name) {
  if (lang === "hi") return name ? `प्रिय ${name}` : "प्रिय टीम";
  return name ? `Dear ${name}` : "Dear Team";
}

function roleByLanguage(role, lang) {
  if (!role) return lang === "hi" ? "टीम सदस्य" : "team member";
  return role;
}

function defaultCompany(lang) {
  if (lang === "hi") return "आपकी कंपनी";
  if (lang === "hinglish") return "Aapki Company";
  return "Your Company";
}

function renderWish(profile) {
  const lang = state.language;
  const company = profile.companyName || defaultCompany(lang);
  const employee = profile.employeeName || "";
  const role = roleByLanguage(profile.role, lang);
  const greeting = greetingByLanguage(lang, employee);

  const mainTemplate = randomTemplate(profile.tone, lang)
    .replace("{greeting}", greeting)
    .replace("{rolePart}", role)
    .replace("{company}", company);

  if (dom.wishCompanyLine) {
    dom.wishCompanyLine.textContent =
      lang === "hi"
        ? `${company} के सभी कर्मचारियों को सफलता, स्वास्थ्य और निरंतर प्रगति की शुभकामनाएं।`
        : lang === "hinglish"
        ? `${company} ke sabhi employees ko success, health aur continuous growth ki wishes.`
        : `Wishing all employees of ${company} success, health, and continued growth.`;
  }

  if (dom.wishMainLine) dom.wishMainLine.textContent = mainTemplate;

  if (dom.wishPersonalLine) {
    dom.wishPersonalLine.textContent =
      lang === "hi"
        ? `${greeting}, आपका समर्पण टीम को आगे बढ़ाता है और प्रेरित करता है।`
        : lang === "hinglish"
        ? `${greeting}, aapka dedication team ko inspire karta hai.`
        : `${greeting}, your dedication inspires the entire team every day.`;
  }

  if (dom.wishSignoff) {
    dom.wishSignoff.textContent =
      lang === "hi"
        ? `सम्मान सहित, ${company} नेतृत्व टीम`
        : lang === "hinglish"
        ? `Respect ke saath, ${company} Leadership Team`
        : `With respect, ${company} Leadership Team`;
  }
}

function readProfile() {
  return {
    employeeName: dom.employeeNameInput?.value.trim() || "",
    companyName: dom.companyNameInput?.value.trim() || "",
    role: dom.employeeRoleInput?.value.trim() || "",
    tone: dom.toneSelect?.value || "formal",
  };
}

function writeProfile(profile) {
  if (dom.employeeNameInput) dom.employeeNameInput.value = profile.employeeName || "";
  if (dom.companyNameInput) dom.companyNameInput.value = profile.companyName || "";
  if (dom.employeeRoleInput) dom.employeeRoleInput.value = profile.role || "";
  if (dom.toneSelect) dom.toneSelect.value = profile.tone || "formal";
}

export function getCurrentWishText() {
  return [dom.wishCompanyLine?.textContent, dom.wishMainLine?.textContent, dom.wishPersonalLine?.textContent]
    .filter(Boolean)
    .join(" ");
}

export function initPersonalization({ onGenerate } = {}) {
  const profile = { ...DEFAULT_PROFILE, ...state.profile };
  writeProfile(profile);
  renderWish(profile);

  const persistDraft = () => {
    updateState("profile", readProfile());
  };

  [dom.employeeNameInput, dom.companyNameInput, dom.employeeRoleInput, dom.toneSelect].forEach((field) => {
    field?.addEventListener("input", persistDraft);
    field?.addEventListener("change", persistDraft);
  });

  dom.generateWishButton?.addEventListener("click", () => {
    const nextProfile = readProfile();
    updateState("profile", nextProfile);
    renderWish(nextProfile);
    incrementWishes();
    if (onGenerate) onGenerate();
  });

  window.addEventListener("languagechange", () => {
    renderWish(readProfile());
  });
}
