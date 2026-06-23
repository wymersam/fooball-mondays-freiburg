import { useState } from "react";
import { apiService } from "../services/apiService";
import { AdminButtonControlsProps } from "../types";
import "../styles/AdminButtonControls.css";

function AdminButtonControls({
  adminPassword,
  overrideState,
  loadStatus,
  setOverrideState,
  onError,
  t,
}: AdminButtonControlsProps) {
  const [resetting, setResetting] = useState(false);
  const [loadingAction, setLoadingAction] = useState<null | string>(null);

  const wrapAction = async (key: string, fn: () => Promise<void>) => {
    try {
      setLoadingAction(key);
      await fn();
      await loadStatus();
    } catch (error: any) {
      onError(error?.message || "Action failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAdminReset = async () => {
    if (!window.confirm(t.adminResetConfirm)) return;

    setResetting(true);
    try {
      await apiService.adminReset(adminPassword);
      setOverrideState("open");
      await loadStatus();
    } catch (error: any) {
      onError(error?.message || "Reset failed");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="admin-bar">
      <button
        className={`admin-btn admin-btn--reset ${
          resetting ? "is-loading" : ""
        }`}
        onClick={handleAdminReset}
        disabled={resetting}
      >
        {resetting ? "⏳" : t.adminReset}
      </button>
      <button
        className={`admin-btn admin-btn--primary ${
          overrideState === "open" ? "is-active" : ""
        } ${loadingAction === "open" ? "is-loading" : ""}`}
        onClick={() =>
          wrapAction("open", async () => {
            if (overrideState === "open") {
              await apiService.adminClearOverride(adminPassword);
              setOverrideState("auto");
            } else {
              await apiService.adminOpenSignups(adminPassword);
              setOverrideState("open");
            }
          })
        }
      >
        {loadingAction === "open"
          ? "⏳"
          : overrideState === "open"
            ? t.adminAutoMode
            : t.adminOpenSignups}
      </button>

      <button
        className={`admin-btn admin-btn--danger ${
          overrideState === "closed" ? "is-active" : ""
        } ${loadingAction === "closed" ? "is-loading" : ""}`}
        onClick={() =>
          wrapAction("closed", async () => {
            if (overrideState === "closed") {
              await apiService.adminClearOverride(adminPassword);
              setOverrideState("auto");
            } else {
              await apiService.adminCloseSignups(adminPassword);
              setOverrideState("closed");
            }
          })
        }
      >
        {loadingAction === "closed"
          ? "⏳"
          : overrideState === "closed"
            ? t.adminAutoMode
            : t.adminCloseSignups}
      </button>
    </div>
  );
}

export default AdminButtonControls;
