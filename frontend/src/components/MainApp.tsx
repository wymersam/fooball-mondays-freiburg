import { useState, useEffect, useRef } from "react";
import StatusCard from "./StatusCard";
import PlayerLists from "./PlayerLists";
import PaymentsList from "./PaymentsList";
import CollectorsList from "./CollectorsList";
import SignupButtons from "./SignupButtons";
import Rules from "./Rules";
import { apiService } from "../services/apiService";
import { MainAppProps, SignupStatus } from "../types";
import { useLanguage } from "../context/LanguageContext";
import Tab from "./Tab";
import AdminButtonControls from "./AdminButtonControls";
import ericGIF from "../images/eric-GIF.gif";

function MainApp({ currentUser, onError, onSessionExpired }: MainAppProps) {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<SignupStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showEricGIF, setShowEricGIF] = useState(false);
  const ericGifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [overrideState, setOverrideState] = useState<
    "auto" | "open" | "closed"
  >("auto");
  const [activeTab, setActiveTab] = useState<
    "players" | "payments" | "collectors"
  >("players");

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [currentUser.username]);

  useEffect(() => {
    apiService.adminCheck().then(({ isAdmin }) => {
      setIsAdmin(isAdmin);
      if (isAdmin) {
        const pwd = window.prompt("Enter admin password:") ?? "";
        setAdminPassword(pwd);
        apiService
          .adminOverrideStatus(pwd)
          .then(({ override }) => setOverrideState(override));
      }
    });
  }, [currentUser.username]);

  useEffect(() => {
    return () => {
      if (ericGifTimer.current) clearTimeout(ericGifTimer.current);
    };
  }, []);

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
      setShowEricGIF(true);
      if (ericGifTimer.current) clearTimeout(ericGifTimer.current);
      ericGifTimer.current = setTimeout(() => setShowEricGIF(false), 5000);
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

  if (loading) {
    return <div className="loading">{t.loadingStatus}</div>;
  }

  return (
    <div className="main-app">
      <StatusCard status={status} language={language} />
      {isAdmin && (
        <AdminButtonControls
          adminPassword={adminPassword}
          overrideState={overrideState}
          loadStatus={loadStatus}
          setOverrideState={setOverrideState}
          onError={onError}
          t={t}
        />
      )}
      <SignupButtons
        status={status}
        onSignup={handleSignup}
        onRemoveSignup={handleRemoveSignup}
      />
      {showEricGIF && (
        <div
          className="signup-celebration-backdrop"
          role="presentation"
          onClick={() => setShowEricGIF(false)}
        >
          <div
            className="signup-celebration-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Signup celebration"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="signup-celebration-close"
              type="button"
              aria-label="Close celebration"
              onClick={() => setShowEricGIF(false)}
            >
              &times;
            </button>
            <img src={ericGIF} alt="Signup celebration" />
          </div>
        </div>
      )}
      <div className="tab-bar">
        <Tab
          label={t.playersTab}
          isActive={activeTab === "players"}
          onClick={() => setActiveTab("players")}
        />
        <Tab
          label={t.paymentsTab}
          isActive={activeTab === "payments"}
          onClick={() => setActiveTab("payments")}
        />
        <Tab
          label={t.collectorsTab}
          isActive={activeTab === "collectors"}
          onClick={() => setActiveTab("collectors")}
        />
      </div>

      {activeTab === "players" ? (
        <PlayerLists
          status={status}
          currentUser={currentUser}
          onRefresh={loadStatus}
          onError={onError}
        />
      ) : activeTab === "payments" ? (
        <PaymentsList
          players={status?.prevMainList ?? []}
          currentUser={currentUser}
          onRefresh={loadStatus}
          onError={onError}
        />
      ) : (
        <CollectorsList />
      )}
      <Rules />
    </div>
  );
}

export default MainApp;
