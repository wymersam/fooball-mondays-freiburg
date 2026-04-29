import React from "react";
import { Signup, User } from "../types";
import { apiService } from "../services/apiService";
import { useLanguage } from "../context/LanguageContext";

interface PaymentsListProps {
  players: Signup[];
  currentUser: User | null;
  onRefresh: () => Promise<void>;
  onError: (message: string) => void;
}

function PaymentsList({
  players,
  currentUser,
  onRefresh,
  onError,
}: PaymentsListProps) {
  const { t } = useLanguage();
  const [paypalInput, setPaypalInput] = React.useState("");
  const [editingPaypal, setEditingPaypal] = React.useState(false);

  const paidCount = players.filter((p) => p.hasPaid).length;
  const collector = players.find((p) => p.paypalRef && p.paypalRef !== "");
  const currentUserEntry = players.find(
    (p) => p.username === currentUser?.username,
  );
  const isCollector = collector?.username === currentUser?.username;
  const canSetPaypal = !collector || isCollector;

  const handleSavePaypal = async () => {
    try {
      await apiService.setPaypalRef(paypalInput.trim());
      await onRefresh();
      setEditingPaypal(false);
    } catch (err: any) {
      onError(err?.message || "Failed to update PayPal details");
    }
  };

  const handleClearPaypal = async () => {
    try {
      await apiService.setPaypalRef("");
      await onRefresh();
      setEditingPaypal(false);
      setPaypalInput("");
    } catch (err: any) {
      onError(err?.message || "Failed to clear PayPal details");
    }
  };

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
      {collector ? (
        <div className="paypal-banner">
          <div className="paypal-banner-info">
            <span className="paypal-banner-label">
              {t.payViaPaypal.replace("{username}", collector.username)}
            </span>
            <a
              className="paypal-banner-link"
              href={
                collector.paypalRef!.startsWith("http")
                  ? collector.paypalRef
                  : `https://paypal.me/${collector.paypalRef!.replace(/^@/, "")}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {collector.paypalRef}
            </a>
          </div>
          {isCollector && (
            <button
              className="paypal-edit-btn"
              onClick={() => {
                setPaypalInput(collector.paypalRef ?? "");
                setEditingPaypal(true);
              }}
            >
              {t.edit}
            </button>
          )}
        </div>
      ) : currentUserEntry && canSetPaypal ? (
        <div className="paypal-banner paypal-banner--empty">
          {editingPaypal ? (
            <div className="paypal-input-row">
              <input
                className="paypal-input"
                type="text"
                placeholder={t.paypalPlaceholder}
                value={paypalInput}
                onChange={(e) => setPaypalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSavePaypal()}
                autoFocus
              />
              <button className="paypal-save-btn" onClick={handleSavePaypal}>
                {t.save}
              </button>
              <button
                className="paypal-cancel-btn"
                onClick={() => setEditingPaypal(false)}
              >
                {t.cancel}
              </button>
            </div>
          ) : (
            <button
              className="paypal-add-btn"
              onClick={() => setEditingPaypal(true)}
            >
              {t.addPaypalDetails}
            </button>
          )}
        </div>
      ) : null}

      {/* Edit mode when collector wants to update */}
      {editingPaypal && isCollector && collector && (
        <div className="paypal-banner">
          <div className="paypal-input-row">
            <input
              className="paypal-input"
              type="text"
              placeholder={t.paypalPlaceholder}
              value={paypalInput}
              onChange={(e) => setPaypalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSavePaypal()}
              autoFocus
            />
            <button className="paypal-save-btn" onClick={handleSavePaypal}>
              {t.save}
            </button>
            <button className="paypal-cancel-btn" onClick={handleClearPaypal}>
              {t.removePaypal}
            </button>
          </div>
        </div>
      )}

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
