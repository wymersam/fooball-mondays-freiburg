import { TabProps } from "../types";
import "../styles/Tab.css";

function Tab({ label, isActive, onClick }: TabProps) {
  return (
    <button
      className={`tab-btn ${isActive ? "tab-btn--active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Tab;
