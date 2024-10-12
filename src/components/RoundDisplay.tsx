import React from "react";
import { hello } from "./hello";
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
      <div>Current Value: {hands.map(hand => hand.HAND).join(', ')}</div>
      {round !== "0" && (
        <RoundResultFormClient
          hands={hands}
          matchId={matchId}
          teamIdToName={teamIdToName}
          isEditMode={true}
          round={round}
          round={round}
        />
      )}
    </div>
  );
};

export default RoundDisplay;
