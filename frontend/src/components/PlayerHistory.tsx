import { useState, useEffect } from "react";
import { PlayerStat } from "../types";
import { apiService } from "../services/apiService";
import { useLanguage } from "../context/LanguageContext";

function PlayerHistory() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getHistory()
      .then(setStats)
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="history-container">
      <h3>{t.playerHistory}</h3>
      {stats.length === 0 ? (
        <p className="history-empty">{t.noHistoryYet}</p>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Player</th>
                <th title={t.gamesPlayed}>⚽</th>
                <th title={t.gamesReserve}>🔄</th>
                <th title={t.dropouts}>❌</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.username} className={s.dropouts >= 3 ? "high-dropout" : ""}>
                  <td className="history-username">{s.username}</td>
                  <td>{s.gamesPlayed}</td>
                  <td>{s.gamesReserve}</td>
                  <td className={s.dropouts >= 3 ? "dropout-warn" : ""}>{s.dropouts}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="history-legend">
            ⚽ {t.gamesPlayed} &nbsp;·&nbsp; 🔄 {t.gamesReserve} &nbsp;·&nbsp; ❌ {t.dropouts}
          </p>
        </div>
      )}
    </div>
  );
}

export default PlayerHistory;
