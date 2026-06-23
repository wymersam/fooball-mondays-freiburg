import PlayerList from "./PlayerList";
import { PlayerListsProps } from "../types";
import { useLanguage } from "../context/LanguageContext";
import "../styles/PlayerLists.css";

function PlayerLists({
  status,
  currentUser,
  onRefresh,
  onError,
}: PlayerListsProps) {
  const { t } = useLanguage();
  if (!status) return null;

  // Fallback to empty arrays if undefined/null
  const mainList = status.mainList || [];
  const reserveList = status.reserveList || [];

  return (
    <div className="lists-container">
      <div className="list-section main-section">
        <div className="list-header">
          <h3 className="list-title">{t.startingXI}</h3>
          <span className="list-count">{mainList.length}/12</span>
        </div>
        <PlayerList
          players={mainList}
          currentUser={currentUser}
          isMainList={true}
          onRefresh={onRefresh}
          onError={onError}
        />
      </div>

      {(reserveList.length > 0 || mainList.length >= 10) && (
        <div className="list-section reserve-section">
          <div className="list-header">
            <h3 className="list-title">{t.reserveList}</h3>
            <span className="list-count">{reserveList.length}</span>
          </div>
          <PlayerList
            players={reserveList}
            currentUser={currentUser}
            isMainList={false}
            onRefresh={onRefresh}
            onError={onError}
          />
        </div>
      )}
    </div>
  );
}

export default PlayerLists;
