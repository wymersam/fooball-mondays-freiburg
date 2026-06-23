import { SignupButtonsProps } from "../types";
import { useLanguage } from "../context/LanguageContext";

function SignupButtons({
  status,
  onSignup,
  onRemoveSignup,
}: SignupButtonsProps) {
  const { t } = useLanguage();
  if (!status) return null;

  // Fallback to empty array if undefined/null
  const mainList = status.mainList || [];

  const showButtons = true;

  if (!showButtons) return null;

  return (
    <div className="action-buttons">
      {status.userSignedUp ? (
        <button className="btn btn-danger btn-block" onClick={onRemoveSignup}>
          {t.removeMySignup}
        </button>
      ) : (
        status.canSignup && (
          <button className="btn btn-primary btn-block" onClick={onSignup}>
            {mainList.length >= 10 ? t.joinReserveList : t.signMeUp}
          </button>
        )
      )}
    </div>
  );
}

export default SignupButtons;
