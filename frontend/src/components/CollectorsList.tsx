import { useEffect, useState } from "react";
import { apiService } from "../services/apiService";
import { useLanguage } from "../context/LanguageContext";

interface CollectorRecord {
  weekKey: string;
  userId: string;
  username: string;
}

function CollectorsList() {
  const { t } = useLanguage();
  const [collectors, setCollectors] = useState<CollectorRecord[]>([]);

  useEffect(() => {
    apiService.getCollectors().then(setCollectors);
  }, []);

  if (collectors.length === 0) {
    return (
      <div className="payments-list">
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h4>{t.noCollectorsYet}</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="collectors-list">
      <p className="collectors-note">{t.collectorsAmountNote}</p>
      <table className="collectors-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Collector</th>
          </tr>
        </thead>
        <tbody>
          {collectors.map((c) => (
            <tr key={c.weekKey}>
              <td>{c.weekKey}</td>
              <td>{c.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollectorsList;
