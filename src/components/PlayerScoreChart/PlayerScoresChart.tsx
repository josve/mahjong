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
    endLabel: {
      show: true,
      position: "right",
      color: getPlayerColor(player),
      fontSize: 14,
      fontWeight: "bold",
      backgroundColor: "white",
      textBorderColor: "white",
      formatter: (params: any) => {
        if (params.dataIndex === scores.length - 1) {
          return `${params.value} ${player}`;
        }
      },
    },
  }));

  const toAdd = labels[labels.length - 1];
  labels.push(toAdd);
  labels.push(toAdd);
  labels.push(toAdd);

  const scoreOptions = {
    animationDuration: "10000",
    title: {
      text: "Poäng",
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
      type: "category",
      boundaryGap: false,
      data: labels,
      axisLabel: {
        formatter: (value: string) => {
          const date = new Date(parseInt(value));
          return `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: scoreSeries,
  };

  return (
    <ReactEcharts
      option={scoreOptions}
      style={{ height: "400px", paddingBottom: "20px" }}
    />
  );
};

export default PlayerScoresChart;
