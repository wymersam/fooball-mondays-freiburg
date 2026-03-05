import { SignupButtonsProps } from "../types";
import { useLanguage } from "../context/LanguageContext";

function SignupButtons({
  status,
  onSignup,
  onRemoveSignup,
}: SignupButtonsProps) {
  const { t } = useLanguage();
  if (!status) return null;

  const showButtons = true;

  if (!showButtons) return null;

  return (
    <div className="action-buttons">
      {status.userSignedUp ? (
        <button className="btn btn-remove" onClick={onRemoveSignup}>
          {t.removeMySignup}
        </button>
      ) : (
        status.canSignup && (
          <button className="btn btn-primary" onClick={onSignup}>
            {status.mainList.length >= 10 ? t.joinReserveList : t.signMeUp}
          </button>
        )
      )}
    </div>
  );
}

export default SignupButtons;
