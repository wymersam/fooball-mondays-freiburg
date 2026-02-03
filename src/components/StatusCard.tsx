import { StatusCardProps } from "../types";

function StatusCard({ status }: StatusCardProps) {
  if (!status) return null;

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
        <h2>⚽ Next week's game</h2>
        <p className="week-date">{formattedDate}</p>
      </div>

      <div className={`signup-status ${status.canSignup ? "open" : "closed"}`}>
        <div className="status-icon">{status.canSignup ? "🟢" : "🔴"}</div>
        <div className="status-text">
          <h3>{status.canSignup ? "Sign-ups are OPEN!" : "Sign-ups Closed"}</h3>
          <p>
            {status.canSignup
              ? "First 10 players get to play!"
              : "List resets Monday 7:00 PM, signups open at 8:00 PM"}
          </p>
        </div>
      </div>

      <div className="game-stats">
        <div className="stat">
          <span className="stat-number">{status.mainList.length}</span>
          <span className="stat-label">Playing</span>
        </div>
        <div className="stat">
          <span className="stat-number">{status.reserveList.length}</span>
          <span className="stat-label">Reserve</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {Math.max(0, 10 - status.mainList.length)}
          </span>
          <span className="stat-label">Spots Left</span>
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
