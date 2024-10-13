import React from "react";
import RoundResultFormEdit from "./RoundResultFormEdit";

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
        <RoundResultFormEdit
          hands={hands}
          matchId={matchId}
          teamIdToName={teamIdToName}
          round={round}
        />
      )}
    </div>
  );
};

export default RoundDisplay;
