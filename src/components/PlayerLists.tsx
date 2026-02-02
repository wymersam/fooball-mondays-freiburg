import React from "react";
import PlayerList from "./PlayerList";
import { PlayerListsProps } from "../types";

function PlayerLists({ status, currentUser }: PlayerListsProps) {
  if (!status) return null;

  return (
    <div className="lists-container">
      <div className="list-section main-section">
        <div className="list-header">
          <h3 className="list-title">🏟️ Starting XI</h3>
          <span className="list-count">{status.mainList.length}/10</span>
        </div>
        <PlayerList
          players={status.mainList}
          currentUser={currentUser}
          isMainList={true}
        />
      </div>

      {(status.reserveList.length > 0 || status.mainList.length >= 10) && (
        <div className="list-section reserve-section">
          <div className="list-header">
            <h3 className="list-title">⏳ Reserve List</h3>
            <span className="list-count">{status.reserveList.length}</span>
          </div>
          <PlayerList
            players={status.reserveList}
            currentUser={currentUser}
            isMainList={false}
          />
        </div>
      )}
    </div>
  );
}

export default PlayerLists;
