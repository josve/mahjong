import React from "react";
import ReactEcharts from "echarts-for-react";
import {MahjongStats} from "@/lib/statistics";

interface PlayerScoresChartProps {
  stats: MahjongStats;
  includeTeams: boolean;
}

const PlayerScoresChart: React.FC<PlayerScoresChartProps> = ({
                                                               stats,
    includeTeams
                                                             }) => {


  const statsToUse = stats.getDataToShow(includeTeams);
  const toAdd = stats.labels[stats.labels.length - 1];
  const currentLabels = [];
  for (const label of stats.labels) {
    currentLabels.push(label);
  }
  currentLabels.push(toAdd);
  currentLabels.push(toAdd);
  currentLabels.push(toAdd);

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
      data: currentLabels,
    },
    yAxis: {
      type: "value",
    },
    series: statsToUse.map((data) => ({
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
    })),
  };


  return (<ReactEcharts
      option={scoreOptions}
      style={{height: "800px", paddingBottom: "20px"}}
  />);
};

export default PlayerScoresChart;
