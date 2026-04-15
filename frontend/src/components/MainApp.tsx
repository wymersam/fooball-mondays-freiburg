import { useState, useEffect } from "react";
import StatusCard from "./StatusCard";
import PlayerLists from "./PlayerLists";
import SignupButtons from "./SignupButtons";
import Rules from "./Rules";
import { apiService } from "../services/apiService";
import { MainAppProps, SignupStatus } from "../types";
import { useLanguage } from "../context/LanguageContext";

function MainApp({ currentUser, onError, onSessionExpired }: MainAppProps) {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<SignupStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [overrideState, setOverrideState] = useState<
    "auto" | "open" | "closed"
  >("auto");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [currentUser.username]);

  useEffect(() => {
    apiService.adminCheck().then(({ isAdmin }) => {
      setIsAdmin(isAdmin);
      if (isAdmin)
        apiService
          .adminOverrideStatus()
          .then(({ override }) => setOverrideState(override));
    });
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
    if (!window.confirm(t.areYouSureRemove)) return;
    try {
      await apiService.removeSignup();
      await loadStatus();
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleAdminReset = async (): Promise<void> => {
    if (!window.confirm(t.adminResetConfirm)) return;
    setResetting(true);
    try {
      await apiService.adminReset();
      setOverrideState("open");
      await loadStatus();
    } catch (error: any) {
      onError(error?.message || "Reset failed");
    } finally {
      setResetting(false);
    }
  };

  const handleAdminOpen = async (): Promise<void> => {
    await apiService.adminOpenSignups();
    setOverrideState("open");
    await loadStatus();
  };

  const handleAdminClose = async (): Promise<void> => {
    await apiService.adminCloseSignups();
    setOverrideState("closed");
    await loadStatus();
  };

  const handleAdminAuto = async (): Promise<void> => {
    await apiService.adminClearOverride();
    setOverrideState("auto");
    await loadStatus();
  };

  if (loading) {
    return <div className="loading">{t.loadingStatus}</div>;
  }

  return (
    <>
      <StatusCard status={status} language={language} />
      {isAdmin && (
        <div className="admin-bar">
          <button
            className="admin-reset-btn"
            onClick={handleAdminReset}
            disabled={resetting}
          >
            {resetting ? "⏳" : t.adminReset}
          </button>
          <button
            className={`admin-override-btn${overrideState === "open" ? " active" : ""}`}
            onClick={
              overrideState === "open" ? handleAdminAuto : handleAdminOpen
            }
          >
            {overrideState === "open" ? t.adminAutoMode : t.adminOpenSignups}
          </button>
          <button
            className={`admin-override-btn danger${overrideState === "closed" ? " active" : ""}`}
            onClick={
              overrideState === "closed" ? handleAdminAuto : handleAdminClose
            }
          >
            {overrideState === "closed" ? t.adminAutoMode : t.adminCloseSignups}
          </button>
        </div>
      )}
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
