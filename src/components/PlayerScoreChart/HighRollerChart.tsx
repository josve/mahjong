import React from "react";

interface HighRollerChartProps {
  highRollerScores: { [key: string]: [number, number, number, boolean][] };
  getPlayerColor: (playerName: string) => string | undefined;
}

const HighRollerChart: React.FC<HighRollerChartProps> = ({
                                                           highRollerScores,
                                                           getPlayerColor,
                                                         }) => {

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
      <div style={{ paddingTop: "20px" }}>
        {Object.entries(highRollerScores).map(([player, scores]) => (
            <div
                key={player}
                style={{marginBottom: "20px"}}
            >
              <h3>{player}</h3>
              <div style={{
                marginTop: "10px",
                display: "grid",
                gap: "5px",
                justifyItems: "center",
                alignItems: "center",
                gridTemplateColumns: "repeat(auto-fill, 30px)"
              }}>
                {scores.map(([gameIndex, score, index, shared]) => (
                    <div
                        key={index}
                        style={{
                          width: getCircleSize(score),
                          height: getCircleSize(score),
                          borderRadius: "50%",
                          ...(shared
                              ? {
                                // Apply a pattern when 'shared' is true
                                backgroundImage: `repeating-linear-gradient(
          120deg,
          ${getPlayerColor(player)} 0%,
          ${getPlayerColor(player)} 2px,
          #ffffff 4px,
          #ffffff 4px
        )`,
                              }
                              : {
                                // Apply solid color when 'shared' is false
                                backgroundColor: getPlayerColor(player),
                              }),
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
          <div style={{ fontStyle: "italic", paddingTop: "20px" }}>
              Streckade cirklar är från när man spelat i lag.
          </div>
      </div>
  );
};

export default HighRollerChart;
