import { useState, FormEvent, ChangeEvent } from "react";
import { AuthFormProps } from "../types";
import { useLanguage } from "../context/LanguageContext";

function AuthForm({ onLogin }: AuthFormProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || username.trim().length < 2) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(username.trim(), isLogin);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameChange = (e: ChangeEvent) => {
    setUsername((e.target as HTMLInputElement).value);
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>{t.welcomeMessage}</h2>
        <p>{isLogin ? t.signInPrompt : t.createAccountPrompt}</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">{t.username}</label>
          <input
            id="username"
            type="text"
            placeholder={t.usernamePlaceholder}
            value={username}
            onChange={handleUsernameChange}
            minLength={2}
            required
            disabled={isSubmitting}
            className={isSubmitting ? "loading" : ""}
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={
            isSubmitting || !username.trim() || username.trim().length < 2
          }
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              {isLogin ? t.signingIn : t.creatingAccount}
            </>
          ) : isLogin ? (
            t.signIn
          ) : (
            t.createAccount
          )}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setIsLogin(!isLogin)}
          disabled={isSubmitting}
        >
          {isLogin ? t.needAccount : t.haveAccount}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
