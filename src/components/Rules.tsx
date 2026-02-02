function Rules() {
  return (
    <div className="rules-card">
      <div className="rules-header">
        <h3>📋 Game Rules</h3>
      </div>
      <div className="rules-content">
        <div className="rule">
          <div className="rule-icon">🕰️</div>
          <div className="rule-text">
            <h4>Sign-up Window</h4>
            <p>Opens Monday at 8:00 PM</p>
          </div>
        </div>

        <div className="rule">
          <div className="rule-icon">🏟️</div>
          <div className="rule-text">
            <h4>Playing Spots</h4>
            <p>First 10 people get to play</p>
          </div>
        </div>

        <div className="rule">
          <div className="rule-icon">⏳</div>
          <div className="rule-text">
            <h4>Reserve List</h4>
            <p>Additional signups go to reserves</p>
          </div>
        </div>

        <div className="rule">
          <div className="rule-icon">👤</div>
          <div className="rule-text">
            <h4>Self Sign-up Only</h4>
            <p>You can only sign yourself up</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rules;
