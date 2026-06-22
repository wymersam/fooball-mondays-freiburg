import React from "react";
import { PaymentsListProps } from "../types";
import { apiService } from "../services/apiService";
import { useLanguage } from "../context/LanguageContext";

function PaymentsList({
  players,
  currentUser,
  onRefresh,
  onError,
}: PaymentsListProps) {
  const { t } = useLanguage();

  const paidCount = players.filter((p) => p.hasPaid).length;

  if (players.length === 0) {
    return (
      <div className="payments-list">
        <div className="empty-state">
          <div className="empty-icon">💶</div>
          <h4>{t.noPaymentsToTrack}</h4>
          <p>{t.noPaymentsDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-list">
      <div className="payments-summary">
        <span className="payments-paid">
          {paidCount} {t.paidLabel}
        </span>
        <span className="payments-separator">/</span>
        <span className="payments-total">
          {players.length} {t.totalLabel}
        </span>
      </div>
      {players.map((player, index) => {
        const isCurrentUser =
          currentUser && player.username === currentUser.username;
        return (
          <div
            key={player.userId || index}
            className={`payment-item ${player.hasPaid ? "payment-item--paid" : "payment-item--unpaid"}`}
          >
            <div className="payment-player-info">
              <div className="player-avatar">
                {player.username.charAt(0).toUpperCase()}
              </div>
              <span className="payment-username">
                {player.username}
                {isCurrentUser && (
                  <span className="you-badge" style={{ marginLeft: "0.5rem" }}>
                    {t.you}
                  </span>
                )}
              </span>
            </div>

            <div className="payment-right">
              {player.hasPaid ? (
                <span className="payment-badge payment-badge--paid">
                  {t.paidBadge}
                </span>
              ) : (
                <span className="payment-badge payment-badge--unpaid">
                  {t.unpaidBadge}
                </span>
              )}

              {isCurrentUser && (
                <button
                  className={`payment-toggle-btn ${
                    player.hasPaid
                      ? "payment-toggle-btn--undo"
                      : "payment-toggle-btn--pay"
                  }`}
                  onClick={async () => {
                    try {
                      await apiService.setPaid(!player.hasPaid);
                      await onRefresh();
                    } catch (err: any) {
                      onError(
                        err?.message || "Failed to update payment status",
                      );
                    }
                  }}
                >
                  {player.hasPaid ? t.undo : t.markAsPaid}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PaymentsList;
