import React from "react";
import ReactEcharts from "echarts-for-react";

interface AverageHanChartProps {
  averageHan: { [key: string]: number };
  playerColors: {
    [key: string]: {
      color_red: number;
      color_green: number;
      color_blue: number;
    };
  };
}

const AverageHanChart: React.FC<AverageHanChartProps> = ({
  averageHan,
  playerColors,
}) => {
  const getPlayerColor = (playerName: string) => {
    const playerColor = playerColors[playerName];
    return playerColor
      ? `rgb(${playerColor.color_red}, ${playerColor.color_green}, ${playerColor.color_blue})`
      : undefined;
  };

  const averageHanSeries = Object.entries(averageHan).map(
    ([player, avgHan]) => ({
      name: player,
      value: avgHan,
      itemStyle: {
        color: getPlayerColor(player),
      },
    })
  );

  const averageHanOptions = {
    title: {
      text: "Genomsnittlig Han per spelare",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: "category",
      data: Object.keys(averageHan),
    },
    series: [
      {
        name: "Genomsnittlig Han",
        type: "bar",
        data: averageHanSeries,
      },
    ],
  };

  return (
    <ReactEcharts
      option={averageHanOptions}
      style={{ height: "400px" }}
    />
  );
};

export default AverageHanChart;
