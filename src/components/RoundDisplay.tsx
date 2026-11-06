import React from "react";
import RoundResultFormEdit from "./RoundResultFormEdit";
import {Hand, IdToName} from "@/types/db";
import {useTranslations} from "next-intl";

interface RoundDisplayProps {
  round: string;
  hands: Hand[];
  matchId: string;
  teamIdToName: IdToName;
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({
  round,
  hands,
  matchId,
  teamIdToName,
}) => {
  const t = useTranslations("match");
  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        border: "1px solid var(--grey-color)",
        padding: "20px",
      }}
    >
      <h2>{t("round", { round })}</h2>
      <div>{t("currentScores", { scores: hands.map((hand) => hand.HAND).join(", ") })}</div>
      <RoundResultFormEdit
        hands={hands}
        matchId={matchId}
        teamIdToName={teamIdToName}
        round={round}
      />
    </div>
  );
};

export default RoundDisplay;
