import { PlayerListProps } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { apiService } from "../services/apiService";

function PlayerList({
  players,
  currentUser,
  isMainList,
  onRefresh,
  onError,
}: PlayerListProps) {
  const { t } = useLanguage();
  if (!players || players.length === 0) {
    return (
      <div
        className={`player-list ${isMainList ? "main-list" : "reserve-list"}`}
      >
        <div className="empty-state">
          <div className="empty-icon">{isMainList ? "🏟️" : "⏳"}</div>
          <h4>{isMainList ? t.noPlayersYet : t.noReservesYet}</h4>
          <p>{isMainList ? t.beTheFirstToSignUp : t.noOneWaitingYet}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`player-list ${isMainList ? "main-list" : "reserve-list"}`}>
      {players.map((player, index) => {
        const isCurrentUser =
          currentUser && player.username === currentUser.username;
        const position = isMainList ? index + 1 : `R${index + 1}`;

        return (
          <div
            key={player.userId || index}
            className={`player-item ${isCurrentUser ? "current-user" : ""} ${player.bibWasher ? "bib-washer-row" : ""}`}
          >
            <div className="player-info">
              <div className="player-avatar">
                {player.username.charAt(0).toUpperCase()}
              </div>
              <div className="player-details">
                <span className="player-name">
                  {player.username}
                  {isCurrentUser && <span className="you-badge">{t.you}</span>}
                  {player.bibWasher && (
                    <span className="bib-washer-badge">🧺 Bib washer</span>
                  )}
                </span>
                <span className="signup-time">
                  {t.signedUpAt}{" "}
                  {new Date(player.signupTime).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isCurrentUser &&
                  !players.some(
                    (p) => p.bibWasher && p.username !== currentUser?.username,
                  ) && (
                    <button
                      className={`bib-washer-button ${player.bibWasher ? "bib-washer-button--active" : ""}`}
                      onClick={async () => {
                        try {
                          await apiService.setBibWasher(!player.bibWasher);
                          await onRefresh();
                        } catch (err: any) {
                          onError(
                            err?.message ||
                              "Failed to update bib washer status",
                          );
                        }
                      }}
                    >
                      {player.bibWasher
                        ? "✕ Unvolunteer"
                        : "🧺 Volunteer to wash bibs"}
                    </button>
                  )}
              </div>
            </div>
            <div
              className={`player-position ${isMainList ? "main" : "reserve"}`}
            >
              {position}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PlayerList;
