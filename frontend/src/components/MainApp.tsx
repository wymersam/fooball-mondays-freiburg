import { useState, useEffect } from "react";
import StatusCard from "./StatusCard";
import PlayerLists from "./PlayerLists";
import SignupButtons from "./SignupButtons";
import Rules from "./Rules";
import { apiService } from "../services/apiService";
import { MainAppProps, SignupStatus } from "../types";
import { useLanguage } from "../context/LanguageContext";

function MainApp({ currentUser, onError, onSessionExpired }: MainAppProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<SignupStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStatus();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [currentUser.username]);

  const loadStatus = async (): Promise<void> => {
    try {
      const statusData = await apiService.getStatus(currentUser.username);
      setStatus(statusData);
    } catch (error) {
      onError("Failed to load current status");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error: any): void => {
    if (error?.message === "Please register first") {
      onSessionExpired();
    } else {
      onError(error?.message || "Something went wrong");
    }
  };

  const handleSignup = async (): Promise<void> => {
    try {
      await apiService.signup();
      await loadStatus();
    } catch (error: any) {
      handleAuthError(error);
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
      handleAuthError(error);
    }
  };

  if (loading) {
    return <div className="loading">{t.loadingStatus}</div>;
  }

  return (
    <>
      <StatusCard status={status} language={useLanguage().language} />
      <SignupButtons
        status={status}
        onSignup={handleSignup}
        onRemoveSignup={handleRemoveSignup}
      />
      <PlayerLists status={status} currentUser={currentUser} />
      <div className="rules-container">
        <Rules />
      </div>
    </>
  );
}

export default MainApp;
