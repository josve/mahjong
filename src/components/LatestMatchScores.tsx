import React, { useEffect, useState } from "react";

const LatestMatchScores = ({ match }: { match: any }) => {
  const [scores, setScores] = useState<any[]>([]);
  const [winner, setWinner] = useState<string>("");

  useEffect(() => {
    const fetchScores = async () => {
      const response = await fetch(`/api/matchChart?matchId=${match.GAME_ID}`);
      const data = await response.json();
      setScores(data.hands);

      // Find the winner (highest score in the last round)
      const lastRound = data.hands.slice(-4);
      const highestScoreHand = lastRound.reduce((prev: any, current: any) =>
        prev.HAND_SCORE > current.HAND_SCORE ? prev : current
      );
      setWinner(highestScoreHand.TEAM_ID);
    };

    fetchScores();
  }, [match.GAME_ID]);

  return (
    <div className="latest-match-scores">
      <h2>Latest Match Scores</h2>
      <div className="winner">
        Winner: {winner}
      </div>
    </div>
  );
};

export default LatestMatchScores;
