import { RuleProps } from "../types";

function Rule({ ruleHeader, ruleDescription, icon }: RuleProps) {
  return (
    <div className="rule">
      <div className="rule-icon">{icon}</div>
      <div className="rule-text">
        <h4>{ruleHeader}</h4>
        <p>{ruleDescription}</p>
      </div>
    </div>
  );
}

export default Rule;
