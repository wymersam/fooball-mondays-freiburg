import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Translations } from "../types/translations";

interface WeatherData {
  temp: number;
  code: number;
}

function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌦️";
  if (code <= 86) return "🌨️";
  return "⛈️";
}

function getWeatherDesc(code: number, t: Translations): string {
  if (code === 0) return t.weatherClear;
  if (code === 1) return t.weatherMainlyClear;
  if (code === 2) return t.weatherPartlyCloudy;
  if (code === 3) return t.weatherOvercast;
  if (code <= 48) return t.weatherFoggy;
  if (code <= 55) return t.weatherDrizzle;
  if (code <= 65) return t.weatherRain;
  if (code <= 77) return t.weatherSnow;
  if (code <= 82) return t.weatherShowers;
  if (code <= 86) return t.weatherSnowShowers;
  return t.weatherThunderstorm;
}

/** Returns YYYY-MM-DD for next Monday (or 7 days from now if today is Monday). */
function getNextMondayDate(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  const daysUntil = day === 1 ? 7 : (8 - day) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntil);
  return monday.toISOString().slice(0, 10);
}

function WeatherWidget() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const monday = getNextMondayDate();
    // Freiburg im Breisgau: 47.999°N 7.842°E
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=47.999&longitude=7.842&hourly=temperature_2m,weathercode&timezone=Europe%2FBerlin&forecast_days=10`,
    )
      .then((r) => r.json())
      .then((data) => {
        // Target 20:00 (game time) on next Monday
        const targetTime = `${monday}T20:00`;
        const idx: number = data.hourly.time.indexOf(targetTime);
        if (idx !== -1) {
          setWeather({
            temp: Math.round(data.hourly.temperature_2m[idx]),
            code: data.hourly.weathercode[idx],
          });
        }
      })
      .catch(() => {
        // Silently fail — widget simply won't render
      });
  }, []);

  if (!weather) return null;

  return (
    <div className="weather-widget" title="Freiburg forecast for game night">
      <span className="weather-label">{t.predictedWeather}:</span>
      <span className="weather-emoji">{getWeatherEmoji(weather.code)}</span>
      <span className="weather-info">
        <span className="weather-temp">{weather.temp}°C</span>
        <span className="weather-desc">{getWeatherDesc(weather.code, t)}</span>
      </span>
    </div>
  );
}

export default WeatherWidget;
