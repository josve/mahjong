import React from "react";
import ReactEcharts from "echarts-for-react";

interface MahjongWinsChartProps {
  mahjongWins: { [key: string]: number };
  getPlayerColor: (playerName: string) => string | undefined;
}

const MahjongWinsChart: React.FC<MahjongWinsChartProps> = ({
                                                             mahjongWins,
                                                             getPlayerColor,
                                                           }) => {

  const winsSeries = Object.entries(mahjongWins).map(([player, wins]) => ({
    name: player,
    value: wins,
    itemStyle: {
      color: getPlayerColor(player),
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
