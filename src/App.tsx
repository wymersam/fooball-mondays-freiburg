import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import MainApp from "./components/MainApp";
import ErrorMessage from "./components/ErrorMessage";
import { authService } from "./services/authService";
import { User } from "./types";

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
    password: string,
    isLogin: boolean,
  ): Promise<void> => {
    try {
      const user = isLogin
        ? await authService.login(username, password)
        : await authService.register(username, password);
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
    <div className="container">
      <ErrorMessage message={error} />

      {!currentUser ? (
        <>
          <AuthForm onLogin={handleLogin} />
          <p className="footer">created by Sammy :)</p>
        </>
      ) : (
        <MainApp
          currentUser={currentUser}
          onError={showError}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
