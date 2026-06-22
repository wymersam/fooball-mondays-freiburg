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
    if (!date.trim() || !name.trim()) {
      return false;
    }
    // Ensure date format is YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date.trim())) {
      return false;
    }

    // Ensure name is longer than 2 characters
    if (name.trim().length < 2) {
      return false;
    }

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
    setCollectors((prev) => [
      ...prev,
      {
        weekKey: collectorDate.trim(),
        userId: "",
        username: collectorName.trim(),
      },
    ]);
    setCollectorDate("");
    setCollectorName("");
    setIsAddingCollector(false);
    setError("");

    apiService
      .addCollector(collectorName, collectorDate.trim())
      .catch((err) => {
        setError(err?.message || "Failed to add collector");
      });
  }

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
      {isAddingCollector && (
        <form className="add-collector-form">
          <input
            id="collectorDate"
            type="text"
            placeholder="Add date"
            className="add-collector-input"
            onChange={(e) => setCollectorDate(e.target.value)}
          ></input>
          <input
            id="collectorName"
            type="text"
            placeholder="Add name"
            className="add-collector-input"
            onChange={(e) => setCollectorName(e.target.value)}
          ></input>
          {collectorDate && collectorName && (
            <button className="save-collector-button" onClick={addCollector}>
              <span className="save-collector-icon">✅</span>
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
        onClick={() => (isAddingCollector ? null : setIsAddingCollector(true))}
      >
        Add new collector
      </button>
      {error && <div className="collector-error">{error}</div>}
    </div>
  );
}

export default CollectorsList;
