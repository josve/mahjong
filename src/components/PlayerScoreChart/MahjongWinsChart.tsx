import React from "react";
import ReactEcharts from "echarts-for-react";
import {IdToNumber, PlayerNameToColor} from "@/types/components";
import {MahjongStats} from "@/lib/statistics";

interface MahjongWinsChartProps {
  stats: MahjongStats;
  includeTeams: boolean;
}

const MahjongWinsChart: React.FC<MahjongWinsChartProps> = ({
                                                             stats,
                                                             includeTeams
                                                           }) => {


  const playerStats = stats.getDataToShow(includeTeams);

  const winsSeries = playerStats.map((data) => ({
    name: data.name,
    value: data.wins,
    itemStyle: {
      color: data.color,
    },
  }));

  const winsOptions = {
    title: {
      text: "Totala Mahjong-vinster per spelare",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "Mahjong-vinster",
        type: "pie",
        radius: ["50%", "30%"],
        data: winsSeries,
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
      option={winsOptions}
      style={{ height: "400px" }}
    />
  );
};

export default MahjongWinsChart;
