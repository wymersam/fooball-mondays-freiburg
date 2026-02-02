import { useState, FormEvent, ChangeEvent } from "react";
import { AuthFormProps } from "../types";

function AuthForm({ onLogin }: AuthFormProps) {
  const [username, setUsername] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || username.trim().length < 2) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(username.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Welcome to Football Mondays! ⚽</h2>
        <p>Enter your name to sign in</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Your Name</label>
          <input
            id="username"
            type="text"
            placeholder="e.g. John Doe"
            value={username}
            onChange={handleInputChange}
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
