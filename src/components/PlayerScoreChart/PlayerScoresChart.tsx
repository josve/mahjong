import React, { useMemo } from "react";
import ReactEcharts from "echarts-for-react";

interface PlayerScoresChartProps {
  playerScores: { [key: string]: number[] };
  labels: string[];
  playerColors: {
    [key: string]: {
      color_red: number;
      color_green: number;
      color_blue: number;
    };
  };
  playerNameToId: { [key: string]: string };
}

const PlayerScoresChart: React.FC<PlayerScoresChartProps> = ({
  playerScores,
  labels,
  playerColors,
  playerNameToId,
}) => {
  const getPlayerColor = (playerName: string) => {
    const playerId = playerNameToId[playerName];
    const playerColor = playerColors[playerId];
    return playerColor
      ? `rgb(${playerColor.color_red}, ${playerColor.color_green}, ${playerColor.color_blue})`
      : undefined;
  };

  const scoreSeries = Object.entries(playerScores).map(([player, scores]) => ({
    name: player,
    type: "line",
    data: scores,
    color: getPlayerColor(player),
    smooth: true,
    lineStyle: {
      width: 2,
      color: getPlayerColor(player),
    },
  }));

  const scoreOptions = {
    title: {
      text: "Spelarpoäng över spel",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: Object.keys(playerScores),
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      data: labels,
    },
    yAxis: {
      type: "value",
    },
    series: scoreSeries,
  };

  return (
    <ReactEcharts
      option={scoreOptions}
      style={{ height: "400px" }}
    />
  );
};

export default PlayerScoresChart;
