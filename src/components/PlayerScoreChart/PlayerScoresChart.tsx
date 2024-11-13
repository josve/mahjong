import React from "react";
import ReactEcharts from "echarts-for-react";
import {MahjongStats} from "@/lib/statistics";

interface PlayerScoresChartProps {
  stats: MahjongStats;
}

const PlayerScoresChart: React.FC<PlayerScoresChartProps> = ({
                                                               stats,
                                                             }) => {

  const statsToUse = stats.getNonTeamStats();
  console.log(statsToUse);

  const scoreSeries = statsToUse.map((data) => ({
    name: data.name,
    type: "line",
    data: data.scores,
    color: data.color,
    smooth: true,
    lineStyle: {
      width: 2,
      color: data.color,
    },
    endLabel: {
      show: true,
      position: "right",
      color: data.color,
      fontSize: 14,
      fontWeight: "bold",
      backgroundColor: "white",
      textBorderColor: "white",
      formatter: (params: any) => {
        if (params.dataIndex === data.scores.length - 1) {
          return `${params.value} ${data.name}`;
        }
      },
    },
  }));

  const toAdd = stats.labels[stats.labels.length - 1];
  stats.labels.push(toAdd);
  stats.labels.push(toAdd);
  stats.labels.push(toAdd);

  const scoreOptions = {
    animationDuration: "5000",
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: statsToUse.map(item => item.name),
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
      data: stats.labels,
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
