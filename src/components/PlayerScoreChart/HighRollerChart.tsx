import React from "react";

interface HighRollerChartProps {
  highRollerScores: { [key: string]: [number, number][] };
  playerColors: {
    [key: string]: {
      color_red: number;
      color_green: number;
      color_blue: number;
    };
  };
  playerNameToId: { [key: string]: string };
}

const HighRollerChart: React.FC<HighRollerChartProps> = ({
  highRollerScores,
  playerColors,
  playerNameToId,
}) => {
  const getPlayerColor = (playerName: string) => {
    const playerId = playerNameToId[playerName];
    const playerColor = playerColors[playerId];
    return playerColor
      ? `rgb(${playerColor.color_red}, ${playerColor.color_green}, ${playerColor.color_blue})`
      : "black";
  };

  const getCircleSize = (score: number) => {
    const minSize = 10;
    const maxSize = 25;
    const minScore = 100;
    const maxScore = 300;
    return (
      minSize +
      ((score - minScore) / (maxScore - minScore)) * (maxSize - minSize)
    );
  };

  return (
    <div>
      <h2>High Roller-ligan (över 100)</h2>
      {Object.entries(highRollerScores).map(([player, scores]) => (
        <div
          key={player}
          style={{ marginBottom: "20px" }}
        >
          <h3>{player}</h3>
          <div style={{ marginTop: "10px", display: "grid", gap: "5px", justifyItems: "center", alignItems: "center", gridTemplateColumns: "repeat(auto-fill, 30px)" }}>
            {scores.map(([gameIndex, score]) => (
              <div
                key={gameIndex}
                style={{
                  width: getCircleSize(score),
                  height: getCircleSize(score),
                  borderRadius: "50%",
                  backgroundColor: getPlayerColor(player),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 5px",
                }}
                title={`Spel #${gameIndex + 1}: ${score}`}
              >
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HighRollerChart;
