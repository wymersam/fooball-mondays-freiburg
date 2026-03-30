import { useState, useEffect, use } from "react";
import { StatusCardProps } from "../types";
import { useLanguage } from "../context/LanguageContext";

function useCountdown(targetISO: string) {
  const calculate = () => {
    const diff = new Date(targetISO).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [timeLeft, setTimeLeft] = useState(calculate);
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return timeLeft;
}

function StatusCard({ status, language }: StatusCardProps) {
  const { t } = useLanguage();
  if (!status) return null;

  // Fallback to empty arrays if undefined/null
  const mainList = status.mainList || [];
  const reserveList = status.reserveList || [];

  let locale: string;

  console.log("Current language:", language); // Debug log to check the language value

  switch (language) {
    case "en":
      locale = "en-US";
      break;
    case "es":
      locale = "es-ES";
      break;
    case "it":
      locale = "it-IT";
      break;
    case "ar":
      locale = "ar-SA";
      break;
    case "de":
      locale = "de-DE";
      break;
    case "pt":
      locale = "pt-PT";
      break;
    default:
      locale = "en-US";
  }

  console.log("Using locale:", locale); // Debug log to check the locale value

  const weekDate = new Date(status.currentWeek);
  weekDate.setDate(weekDate.getDate() + 7);

  const formattedDate = weekDate.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const countdown = useCountdown(status.nextReset);
  const pad = (n: number) => String(n).padStart(2, "0");
  const countdownStr =
    countdown.days > 0
      ? `${countdown.days}d ${pad(countdown.hours)}h ${pad(countdown.minutes)}m ${pad(countdown.seconds)}s`
      : `${pad(countdown.hours)}h ${pad(countdown.minutes)}m ${pad(countdown.seconds)}s`;

  return (
    <div className="status-card">
      <div className="status-header">
        <h2>
          {t.nextGame}: {formattedDate}
        </h2>
        <p className="reset-countdown">🔄 Resets in: {countdownStr}</p>
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
