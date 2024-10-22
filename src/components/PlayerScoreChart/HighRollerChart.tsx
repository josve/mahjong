import React from "react";
import ReactEcharts from "echarts-for-react";

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
      : undefined;
  };

  const highRollerSeries = Object.entries(highRollerScores).map(
    ([player, scores]) => ({
      name: player,
      type: "scatter",
      data: scores.map((score) => [score[0], score[1], player]), // [gameIndex, han, playerName]
      symbolSize: (data: number[]) => (data[1] - 100) / 3 + 10, // Adjust size based on score
      itemStyle: {
        color: getPlayerColor(player),
      },
    })
  );

  const highRollerOptions = {
    title: {
      text: "High Roller-ligan (Händer över 100 han)",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const playerName = params.data[2];
        const gameIndex = params.data[0] + 1; // Add 1 to make it 1-indexed
        const hand = params.data[1];
        return `${playerName}<br/>Spel #${gameIndex}: ${hand} han`;
      },
    },
    grid: {
      left: "5%",
      right: "15%",
      top: "10%",
      bottom: "10%",
    },
    xAxis: {
      type: "value",
      name: "Spelnummer",
      nameLocation: "middle",
      nameGap: 30,
      min: 0,
    },
    yAxis: {
      type: "value",
      name: "Han",
      nameLocation: "middle",
      nameGap: 40,
      min: 100,
    },
    series: highRollerSeries,
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: 20,
      bottom: 20,
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "empty",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "empty",
      },
    ],
  };

  return (
    <ReactEcharts
      option={highRollerOptions}
      style={{ height: "400px" }}
    />
  );
};

export default HighRollerChart;
