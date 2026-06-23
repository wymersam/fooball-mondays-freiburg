import { useLanguage } from "../context/LanguageContext";
import { Language, languageNames, languageFlags } from "../types/translations";
import "../styles/LanguageSelector.css";

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["en", "es", "it", "ar", "de", "pt"];

  return (
    <div className="language-selector-wrapper">
      <div
        className="language-selector"
        role="group"
        aria-label="Language selector"
      >
        {languages.map((lang) => {
          const isActive = language === lang;

          return (
            <button
              key={lang}
              type="button"
              className={`language-btn ${isActive ? "active" : ""}`}
              onClick={() => setLanguage(lang)}
              title={languageNames[lang]}
              aria-pressed={isActive}
              aria-label={`Switch to ${languageNames[lang]}`}
            >
              <span className="language-flag">{languageFlags[lang]}</span>
              <span className="language-name">{languageNames[lang]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageSelector;
