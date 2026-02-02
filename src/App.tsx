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

  const handleLogin = async (username: string): Promise<void> => {
    try {
      const user = await authService.register(username);
      setCurrentUser(user);
      setError("");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  const showError = (message: string): void => {
    setError(message);
    setTimeout(() => setError(""), 5000);
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
        <MainApp currentUser={currentUser} onError={showError} />
      )}
    </div>
  );
}

export default App;
