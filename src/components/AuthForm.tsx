import { useState, FormEvent, ChangeEvent } from "react";
import { AuthFormProps } from "../types";
import { useLanguage } from "../context/LanguageContext";

function AuthForm({ onLogin }: AuthFormProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || username.trim().length < 2 || password.length < 4) {
      return;
    }

    // For registration, email is optional but validate if provided
    if (!isLogin && email && !email.includes("@")) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(username.trim(), password, isLogin, email.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameChange = (e: ChangeEvent) => {
    setUsername((e.target as HTMLInputElement).value);
  };

  const handlePasswordChange = (e: ChangeEvent) => {
    setPassword((e.target as HTMLInputElement).value);
  };

  const handleEmailChange = (e: ChangeEvent) => {
    setEmail((e.target as HTMLInputElement).value);
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
        <div className="input-group">
          <label htmlFor="password">{t.password}</label>
          <input
            id="password"
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={handlePasswordChange}
            minLength={4}
            required
            disabled={isSubmitting}
            className={isSubmitting ? "loading" : ""}
          />
        </div>
        {!isLogin && (
          <div className="input-group">
            <label htmlFor="email">{t.email}</label>
            <input
              id="email"
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={handleEmailChange}
              disabled={isSubmitting}
              className={isSubmitting ? "loading" : ""}
            />
            <small className="input-hint">{t.emailHint}</small>
          </div>
        )}
        <button
          type="submit"
          className="btn-primary"
          disabled={
            isSubmitting ||
            !username.trim() ||
            username.trim().length < 2 ||
            password.length < 4
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
