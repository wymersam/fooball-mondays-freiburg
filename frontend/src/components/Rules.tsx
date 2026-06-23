import { useLanguage } from "../context/LanguageContext";
import Rule from "./Rule";
import { CiClock1 } from "react-icons/ci";
import { IoHourglassOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { FaShirt } from "react-icons/fa6";
import { GiSoccerBall } from "react-icons/gi";
import { TbMoneybag } from "react-icons/tb";
import { TbNumber12Small } from "react-icons/tb";
import "../styles/Rules.css";

function Rules() {
  const { t } = useLanguage();
  return (
    <div className="rules-container">
      <div className="rules-card">
        <div className="rules-header">
          <h3>{t.gameRules}</h3>
        </div>
        <div className="rules-content">
          <Rule
            ruleHeader={t.signupWindow}
            ruleDescription={t.signupWindowDesc}
            icon={<CiClock1 size={24} />}
          />
          <Rule
            ruleHeader={t.playingSpots}
            ruleDescription={t.playingSpotsDesc}
            icon={<TbNumber12Small size={24} />}
          />
          <Rule
            ruleHeader={t.reserveListRule}
            ruleDescription={t.reserveListRuleDesc}
            icon={<IoHourglassOutline size={24} />}
          />
          <Rule
            ruleHeader={t.selfSignupOnly}
            ruleDescription={t.selfSignupOnlyDesc}
            icon={<IoPersonOutline size={24} />}
          />
          <Rule
            ruleHeader={t.bibRule}
            ruleDescription={t.bibRuleDesc}
            icon={<FaShirt size={24} />}
          />
          <Rule
            ruleHeader={t.ballRule}
            ruleDescription={t.ballRuleDesc}
            icon={<GiSoccerBall size={24} />}
          />
          <Rule
            ruleHeader={t.paymentRule}
            ruleDescription={t.paymentRuleDesc}
            icon={<TbMoneybag size={24} />}
          />
        </div>
      </div>
    </div>
  );
}

export default Rules;
