import { useState, useEffect } from "react";
import StatusCard from "./StatusCard";
import PlayerLists from "./PlayerLists";
import SignupButtons from "./SignupButtons";
import Rules from "./Rules";
import { apiService } from "../services/apiService";
import { authService } from "../services/authService";
import { MainAppProps, SignupStatus } from "../types";
import { useLanguage } from "../context/LanguageContext";

function MainApp({ currentUser, onError, onLogout }: MainAppProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<SignupStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStatus();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async (): Promise<void> => {
    try {
      const statusData = await apiService.getStatus();
      setStatus(statusData);
    } catch (error) {
      onError("Failed to load current status");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (): Promise<void> => {
    try {
      await apiService.signup();
      await loadStatus();
    } catch (error: any) {
      onError(error.message || "Signup failed");
    }
  };

  const handleRemoveSignup = async (): Promise<void> => {
    if (!window.confirm(t.areYouSureRemove)) {
      return;
    }

    try {
      await apiService.removeSignup();
      await loadStatus();
    } catch (error: any) {
      onError(error.message || "Failed to remove signup");
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.logout();
      onLogout();
    } catch (error: any) {
      onError(error.message || "Logout failed");
    }
  };

  if (loading) {
    return <div className="loading">{t.loadingStatus}</div>;
  }

  return (
    <>
      <div className="user-info">
        <span>
          {t.signedInAs} <strong>{currentUser.username}</strong>
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          {t.signOut}
        </button>
      </div>

      <StatusCard status={status} />

      <SignupButtons
        status={status}
        onSignup={handleSignup}
        onRemoveSignup={handleRemoveSignup}
      />

      <PlayerLists status={status} currentUser={currentUser} />

      <Rules />
    </>
  );
}

export default MainApp;
