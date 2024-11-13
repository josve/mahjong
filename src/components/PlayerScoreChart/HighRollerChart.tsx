import React from "react";
import {MahjongStats} from "@/lib/statistics";

interface HighRollerChartProps {
    stats: MahjongStats;
}

const HighRollerChart: React.FC<HighRollerChartProps> = ({
                                                           stats
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

  const playerStats = stats.getNonTeamStats();

  return (
      <div style={{ paddingTop: "20px" }}>
        {playerStats.map((data) => (
            <div
                key={data.id}
                style={{marginBottom: "20px"}}
            >
              <h3>{data.name}</h3>
              <div style={{
                marginTop: "10px",
                display: "grid",
                gap: "5px",
                justifyItems: "center",
                alignItems: "center",
                gridTemplateColumns: "repeat(auto-fill, 30px)"
              }}>
                {data.highRollers.map((highRoller) => (
                    <div
                        key={highRoller.highRollerIndex}
                        style={{
                          width: getCircleSize(highRoller.hand),
                          height: getCircleSize(highRoller.hand),
                          borderRadius: "50%",
                          ...(highRoller.isTeam
                              ? {
                                // Apply a pattern when 'shared' is true
                                backgroundImage: `repeating-linear-gradient(
          120deg,
          ${data.color} 0%,
          ${data.color} 2px,
          #ffffff 4px,
          #ffffff 4px
        )`,
                              }
                              : {
                                // Apply solid color when 'shared' is false
                                backgroundColor: data.color,
                              }),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 5px",
                        }}
                        title={`Spel #${highRoller.gameIndex + 1}: ${highRoller.hand}`}
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
