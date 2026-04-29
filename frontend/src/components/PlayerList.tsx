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
            key={index}
            className={`player-item ${isCurrentUser ? "current-user" : ""} ${player.bibWasher ? "bib-washer-row" : ""} ${player.ballBringer ? "ball-bringer-row" : ""}`}
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
                    <span className="bib-washer-badge">{t.bibWasherBadge}</span>
                  )}
                  {player.ballBringer && (
                    <span className="ball-bringer-badge">
                      {t.ballBringerBadge}
                    </span>
                  )}
                </span>
                <span className="signup-time">
                  {t.signedUpAt}{" "}
                  {new Date(player.signupTime).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isCurrentUser &&
                  isMainList &&
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
                        ? t.unvolunteerBibs
                        : t.volunteerToWashBibs}
                    </button>
                  )}
                {isCurrentUser && isMainList && (
                  <button
                    className={`ball-bringer-button ${player.ballBringer ? "ball-bringer-button--active" : ""}`}
                    onClick={async () => {
                      try {
                        await apiService.setBallBringer(!player.ballBringer);
                        await onRefresh();
                      } catch (err: any) {
                        onError(
                          err?.message ||
                            "Failed to update bringing ball status",
                        );
                      }
                    }}
                  >
                    {player.ballBringer ? t.unvolunteerBall : t.canBringBall}
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
