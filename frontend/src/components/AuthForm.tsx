import { useState, SubmitEvent, ChangeEvent } from "react";
import { AuthFormProps } from "../types";
import { useLanguage } from "../context/LanguageContext";

function AuthForm({ onLogin }: AuthFormProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!username.trim() || username.trim().length < 2) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(username.trim());
      // Save to localStorage on successful login
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ username: username.trim() }),
      );
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
        <p>{t.signInPrompt}</p>
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
          className="btn btn-primary"
          disabled={
            isSubmitting || !username.trim() || username.trim().length < 2
          }
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              {t.signingIn}
            </>
          ) : (
            t.signIn
          )}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
