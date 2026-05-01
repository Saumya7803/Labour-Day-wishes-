import { I18N } from "./config.js";
import { dom } from "./dom.js";
import { state, updateState } from "./state.js";

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const value = dict[key];
    if (value) node.textContent = value;
  });

  dom.languageButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  dom.employeeNameInput?.setAttribute("placeholder", lang === "hi" ? "कर्मचारी का नाम लिखें" : lang === "hinglish" ? "Employee ka naam likho" : "Enter employee name");
  dom.companyNameInput?.setAttribute("placeholder", lang === "hi" ? "कंपनी का नाम लिखें" : lang === "hinglish" ? "Company ka naam likho" : "Enter company name");
  dom.employeeRoleInput?.setAttribute("placeholder", lang === "hi" ? "उदाहरण: संचालन प्रबंधक" : lang === "hinglish" ? "Example: Operations Manager" : "Example: Operations Manager");
}

export function getTranslation(key) {
  const dict = I18N[state.language] || I18N.en;
  return dict[key] || I18N.en[key] || key;
}

export function initI18n() {
  applyLanguage(state.language);

  dom.languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      updateState("language", lang);
      applyLanguage(lang);
      window.dispatchEvent(new CustomEvent("languagechange", { detail: lang }));
    });
  });
}
