import React from "react";
import RoundResultFormEdit from "./roundResultFormEdit";

interface RoundDisplayProps {
  round: string;
  hands: any[];
  matchId: string;
  teamIdToName: { [key: string]: string };
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({
  round,
  hands,
  matchId,
  teamIdToName,
}) => {
  return (
    <div className="correct-round">
      <h2>Runda {round}</h2>
      <div>Nuvarande poäng: {hands.map((hand) => hand.HAND).join(", ")}</div>
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
