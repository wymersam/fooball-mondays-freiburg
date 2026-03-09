import { StatusCardProps } from "../types";
import { useLanguage } from "../context/LanguageContext";

function StatusCard({ status }: StatusCardProps) {
  const { t } = useLanguage();
  if (!status) return null;

  // Fallback to empty arrays if undefined/null
  const mainList = status.mainList || [];
  const reserveList = status.reserveList || [];

  const weekDate = new Date(status.currentWeek);
  weekDate.setDate(weekDate.getDate() + 7);
  const formattedDate = weekDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="status-card">
      <div className="status-header">
        <h2>
          {t.nextGame}: {formattedDate}
        </h2>
      </div>

      <div className={`signup-status ${status.canSignup ? "open" : "closed"}`}>
        <div className="status-text">
          <h3>{status.canSignup ? t.signupsOpen : t.signupsClosed}</h3>
        </div>
      </div>

      <div className="game-stats">
        <div className="stat">
          <span className="stat-number">{mainList.length}</span>
          <span className="stat-label">{t.playing}</span>
        </div>
        <div className="stat">
          <span className="stat-number">{reserveList.length}</span>
          <span className="stat-label">{t.reserve}</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {Math.max(0, 10 - mainList.length)}
          </span>
          <span className="stat-label">{t.spotsLeft}</span>
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
