import { useEffect, useState } from "react";
import { apiService } from "../services/apiService";
import { useLanguage } from "../context/LanguageContext";
import { TiTick } from "react-icons/ti";
import { TbPigMoney } from "react-icons/tb";
import { CollectorRecord } from "../types";
import "../styles/CollectorsList.css";

function CollectorsList() {
  const { t } = useLanguage();

  const [collectors, setCollectors] = useState<CollectorRecord[]>([]);
  const [isAddingCollector, setIsAddingCollector] = useState(false);
  const [collectorName, setCollectorName] = useState("");
  const [collectorDate, setCollectorDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiService.getCollectors().then(setCollectors);
  }, []);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  function validateCollectorInput(date: string, name: string): boolean {
    if (!date.trim() || !name.trim()) return false;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date.trim())) return false;

    if (name.trim().length < 2) return false;

    return true;
  }

  function addCollector(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!validateCollectorInput(collectorDate, collectorName)) {
      setError(
        "Date must be in YYYY-MM-DD format and name must be at least 2 characters long.",
      );
      return;
    }

    const newCollector = {
      weekKey: collectorDate.trim(),
      userId: "",
      username: collectorName.trim(),
    };

    setCollectors((prev) => [newCollector, ...prev]);

    setCollectorDate("");
    setCollectorName("");
    setIsAddingCollector(false);
    setError("");

    apiService.addCollector(newCollector).catch((err) => {
      setError(err?.message || "Failed to add collector");
    });
  }

  if (collectors.length === 0) {
    return (
      <div className="payments-list">
        <div className="empty-state">
          <div className="empty-icon">
            <TbPigMoney size={48} />
          </div>
          <h4>{t.noCollectorsYet}</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="collectors-list">
      <table className="collectors-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Collector</th>
          </tr>
        </thead>
        <tbody>
          {collectors.map((c) => (
            <tr key={`${c.weekKey}-${c.username}`}>
              <td>{c.weekKey}</td>
              <td>{c.username}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddingCollector && (
        <form className="add-collector-form">
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            className="add-collector-input"
            value={collectorDate}
            onChange={(e) => setCollectorDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Name"
            className="add-collector-input"
            value={collectorName}
            onChange={(e) => setCollectorName(e.target.value)}
          />

          {collectorDate && collectorName && (
            <button
              type="button"
              className="save-collector-button"
              onClick={addCollector}
            >
              <TiTick color="#57c457" />
            </button>
          )}
        </form>
      )}

      <button
        className={
          isAddingCollector
            ? "hide-add-collector-button"
            : "add-collector-button"
        }
        onClick={() => setIsAddingCollector(true)}
      >
        Add new collector
      </button>

      {error && <div className="collector-error">{error}</div>}
    </div>
  );
}

export default CollectorsList;
