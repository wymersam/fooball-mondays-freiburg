import { useLanguage } from "../context/LanguageContext";
import { Language, languageNames, languageFlags } from "../types/translations";

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["en", "es", "it", "ar", "de", "pt"];

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang}
          className={`language-btn ${language === lang ? "active" : ""}`}
          onClick={() => setLanguage(lang)}
          title={languageNames[lang]}
        >
          <span className="language-flag">{languageFlags[lang]}</span>
          <span className="language-name">{languageNames[lang]}</span>
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;
