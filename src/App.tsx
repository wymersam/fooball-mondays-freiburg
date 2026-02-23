import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import MainApp from "./components/MainApp";
import ErrorMessage from "./components/ErrorMessage";
import LanguageSelector from "./components/LanguageSelector";
import { authService } from "./services/authService";
import { User } from "./types";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async (): Promise<void> => {
    try {
      const user = await authService.checkAuth();
      setCurrentUser(user);
    } catch (err) {
      console.log("Not authenticated");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (
    username: string,
    isLogin: boolean,
  ): Promise<void> => {
    try {
      const user = isLogin
        ? await authService.login(username)
        : await authService.register(username);
      setCurrentUser(user);
      setError("");
    } catch (err: any) {
      setError(
        err.message || (isLogin ? "Login failed" : "Registration failed"),
      );
    }
  };

  const showError = (message: string): void => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setError("");
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <div className="language-selector-wrapper">
        <LanguageSelector />
      </div>
      <div className="container">
        <ErrorMessage message={error} />

        {!currentUser ? (
          <>
            <AuthForm onLogin={handleLogin} />
          </>
        ) : (
          <MainApp
            currentUser={currentUser}
            onError={showError}
            onLogout={handleLogout}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
