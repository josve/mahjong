import React from "react";
import RoundResultFormClient from "./RoundResultFormClient";

interface RoundDisplayProps {
  round: string;
  hands: any[];
  matchId: string;
  teamIdToName: { [key: string]: string };
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({ round, hands, matchId, teamIdToName }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Round {round}</h2>
      <RoundResultFormClient
        hands={hands}
        matchId={matchId}
        teamIdToName={teamIdToName}
        isEditMode={true}
      />
    </div>
  );
};

export default RoundDisplay;
