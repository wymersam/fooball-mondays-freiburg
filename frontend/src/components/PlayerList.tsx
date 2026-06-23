import { PlayerListProps } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { apiService } from "../services/apiService";
import { TbMoodEmpty } from "react-icons/tb";
import { IoHourglassOutline } from "react-icons/io5";
import { GiSoccerBall } from "react-icons/gi";
import { FaShirt } from "react-icons/fa6";
import { CgCloseO } from "react-icons/cg";
import { getAvatar } from "../utils/get-avatar";

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
          <div className="empty-icon">
            {isMainList ? (
              <TbMoodEmpty size={24} />
            ) : (
              <IoHourglassOutline size={24} />
            )}
          </div>
          <h4>{isMainList ? t.noPlayersYet : t.noReservesYet}</h4>
          <p>{isMainList ? t.beTheFirstToSignUp : t.noOneWaitingYet}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`player-list ${isMainList ? "main-list" : "reserve-list"}`}>
      {players.map((player, index) => {
        const AvatarIcon = getAvatar(player.username);
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
                <AvatarIcon size={32} />
              </div>
              <div className="player-details">
                <span className="player-name">
                  {player.username}
                  {isCurrentUser && <span className="you-badge">{t.you}</span>}
                  {player.bibWasher && <FaShirt size={16} />}
                  {player.ballBringer && <GiSoccerBall size={16} />}
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
                      {player.bibWasher ? (
                        <span className="unvolunteer-bibs-text">
                          <CgCloseO size={16} /> {t.unvolunteerBibs}
                        </span>
                      ) : (
                        <span className="volunteer-bibs-text">
                          <FaShirt size={16} /> {t.volunteerToWashBibs}
                        </span>
                      )}
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
                    {player.ballBringer ? (
                      <span className="unvolunteer-ball-text">
                        <CgCloseO size={16} />
                        {t.unvolunteerBall}
                      </span>
                    ) : (
                      <span className="volunteer-ball-text">
                        <GiSoccerBall size={16} />
                        {t.canBringBall}
                      </span>
                    )}
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
