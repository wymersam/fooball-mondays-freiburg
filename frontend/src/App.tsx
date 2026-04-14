import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import MainApp from "./components/MainApp";
import LanguageSelector from "./components/LanguageSelector";
import ErrorMessage from "./components/ErrorMessage";
import { User } from "./types";
import { apiService } from "./services/apiService";
import { LanguageProvider } from "./context/LanguageContext";
import { useLanguage } from "./context/LanguageContext";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.username) {
          setCurrentUser({ username: parsed.username });
        }
      } catch (e) {
        // If parsing fails, clear the invalid data
        localStorage.removeItem("currentUser");
        console.error("Failed to parse saved user from localStorage", e);
      }
    }
  }, []);

  const handleLogin = async (username: string): Promise<void> => {
    try {
      // Try to log in first
      const response = await apiService.loginUser(username);
      setCurrentUser({ username: response.username });
      setError("");
    } catch (err: any) {
      // If login fails due to user not found, try to register
      if (
        err.message &&
        (err.message.includes("Invalid username") ||
          err.message.includes("not found"))
      ) {
        try {
          const regResponse = await apiService.registerUser(username);
          setCurrentUser({ username: regResponse.username });
          setError("");
        } catch (regErr: any) {
          setError(regErr.message || "Registration failed");
        }
      } else {
        setError(err.message || "Login failed");
      }
    }
  };

  const showError = (message: string): void => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleSessionExpired = (): void => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setError("");
  };

  return (
    <LanguageProvider>
      <div className="language-selector-wrapper">
        <LanguageSelector />
      </div>
      <div className="container">
        <ErrorMessage message={error} />
        {!currentUser ? (
          <AuthForm onLogin={handleLogin} />
        ) : (
          <MainApp
            currentUser={currentUser}
            onError={showError}
            onSessionExpired={handleSessionExpired}
          />
        )}
      </div>
      <p className="created-by-footer">
        <Footer />
      </p>
    </LanguageProvider>
  );
}

function Footer() {
  const { t } = useLanguage();
  return <>{t.createdBy}</>;
}

export default App;
