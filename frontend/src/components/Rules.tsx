import { useLanguage } from "../context/LanguageContext";

function Rules() {
  const { t } = useLanguage();
  return (
    <div className="rules-card">
      <div className="rules-header">
        <h3>{t.gameRules}</h3>
      </div>
      <div className="rules-content">
        <div className="rule">
          <div className="rule-icon">🕰️</div>
          <div className="rule-text">
            <h4>{t.signupWindow}</h4>
            <p>{t.signupWindowDesc}</p>
          </div>
        </div>

        <div className="rule">
          <div className="rule-icon">🏟️</div>
          <div className="rule-text">
            <h4>{t.playingSpots}</h4>
            <p>{t.playingSpotsDesc}</p>
          </div>
        </div>

        <div className="rule">
          <div className="rule-icon">⏳</div>
          <div className="rule-text">
            <h4>{t.reserveListRule}</h4>
            <p>{t.reserveListRuleDesc}</p>
          </div>
        </div>

        <div className="rule">
          <div className="rule-icon">👤</div>
          <div className="rule-text">
            <h4>{t.selfSignupOnly}</h4>
            <p>{t.selfSignupOnlyDesc}</p>
          </div>
        </div>
        <div className="rule">
          <div className="rule-icon">🧺</div>
          <div className="rule-text">
            <h4>{t.bibRule}</h4>
            <p>{t.bibRuleDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rules;
