import React from "react";
import ReactEcharts from "echarts-for-react";

interface StandardDeviationChartProps {
  standardDeviations: { [key: string]: number };
  getPlayerColor: (playerName: string) => string | undefined;
}

const StandardDeviationChart: React.FC<StandardDeviationChartProps> = ({
  standardDeviations,
  getPlayerColor,
}) => {
  const data = Object.entries(standardDeviations).map(([player, stdDev]) => ({
    name: player,
    value: stdDev,
    itemStyle: {
      color: getPlayerColor(player),
    },
  }));

  const options = {
    title: {
      text: "Standardavvikelser av handpoäng per spelare",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}",
    },
    series: [
      {
        name: "Standardavvikelser",
        type: "bar",
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <ReactEcharts
      option={options}
      style={{ height: "400px" }}
    />
  );
};

export default StandardDeviationChart;
