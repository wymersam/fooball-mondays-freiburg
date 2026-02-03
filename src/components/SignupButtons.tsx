import { SignupButtonsProps } from "../types";
import { useLanguage } from "../context/LanguageContext";

function SignupButtons({
  status,
  onSignup,
  onRemoveSignup,
}: SignupButtonsProps) {
  const { t } = useLanguage();
  if (!status) return null;

  const showButtons = status.canSignup || status.userSignedUp;

  if (!showButtons) return null;

  return (
    <div className="action-buttons">
      {status.userSignedUp ? (
        <button className="btn btn-danger" onClick={onRemoveSignup}>
          <span className="btn-icon">❌</span>
          {t.removeMySignup}
        </button>
      ) : (
        status.canSignup && (
          <button className="btn btn-success" onClick={onSignup}>
            <span className="btn-icon">⚽</span>
            {status.mainList.length >= 10 ? t.joinReserveList : t.signMeUp}
          </button>
        )
      )}
    </div>
  );
}

export default SignupButtons;
