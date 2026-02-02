import { SignupButtonsProps } from "../types";

function SignupButtons({
  status,
  onSignup,
  onRemoveSignup,
}: SignupButtonsProps) {
  if (!status) return null;

  const showButtons = status.canSignup || status.userSignedUp;

  if (!showButtons) return null;

  return (
    <div className="action-buttons">
      {status.userSignedUp ? (
        <button className="btn btn-danger" onClick={onRemoveSignup}>
          <span className="btn-icon">❌</span>
          Remove My Signup
        </button>
      ) : (
        status.canSignup && (
          <button className="btn btn-success" onClick={onSignup}>
            <span className="btn-icon">⚽</span>
            {status.mainList.length >= 10 ? "Join Reserve List" : "Sign Me Up!"}
          </button>
        )
      )}
    </div>
  );
}

export default SignupButtons;
