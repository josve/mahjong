import React from "react";
import ReactEcharts from "echarts-for-react";

interface MahjongWinsChartProps {
  mahjongWins: { [key: string]: number };
  playerColors: {
    [key: string]: {
      color_red: number;
      color_green: number;
      color_blue: number;
    };
  };
}

const MahjongWinsChart: React.FC<MahjongWinsChartProps> = ({
  mahjongWins,
  playerColors,
}) => {
  const getPlayerColor = (playerName: string) => {
    const playerColor = playerColors[playerName];
    return playerColor
      ? `rgb(${playerColor.color_red}, ${playerColor.color_green}, ${playerColor.color_blue})`
      : undefined;
  };

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
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Mahjong-vinster",
        type: "pie",
        radius: "50%",
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
