"use client";
import React from "react";
import ReactEcharts from "echarts-for-react";

export default function MatchChart({
  hands,
  teamHands,
  teamIdToName,
  teamColors,
}: {
  hands: any[];
  teamHands: any[];
  teamIdToName: { [key: string]: string };
  teamColors: any;
}) {
  // Initialize rounds starting from 1
  const rounds = Array.from({ length: 19 }, (_, i) => (i + 1).toString());

  const getTeamName = (teamId: string) => {
    return teamIdToName[teamId] || "Unknown Team";
  };

  let series = [];

  // Calculate the percentage of wins for each player
  const winCounts = hands.reduce((acc: any, hand: any) => {
    if (hand.IS_WINNER) {
      acc[hand.TEAM_ID] = (acc[hand.TEAM_ID] || 0) + 1;
    }
    return acc;
  }, {});

  const totalWins: any = Object.values(winCounts).reduce(
    (sum: any, count: any) => sum + count,
    0
  );

  const pieData = Object.keys(winCounts).map((teamId) => ({
    value: winCounts[teamId],
    name: getTeamName(teamId),
    itemStyle: {
      color: teamColors[teamId]
        ? `rgb(${teamColors[teamId].color_red}, ${teamColors[teamId].color_green}, ${teamColors[teamId].color_blue})`
        : "transparent", // Use transparent if no color is found
      formatter: (params: any) => {
        if (Array.isArray(params)) {
          return params
            .map((param) => {
              const teamName = getTeamName(param.seriesName);
              if (teamName !== "Unknown Team") {
                const windHand = param.data.name.WIND_HAND;
                const handScore = param.data.name.HAND_SCORE;
                const isWinner = param.data.name.IS_WINNER;
                const mahjongText = isWinner ? " mahjong" : "";
                return `${teamName}: ${
                  param.value - 500
                } (${windHand} HANDp${mahjongText}, ${handScore})`;
              }
              return null;
            })
            .filter((text) => text !== null)
            .join("<br/>");
        } else {
          const teamName = getTeamName(params.name);
          const percentage = ((params.value / totalWins) * 100).toFixed(2);
          return `${teamName}: ${params.value} wins (${percentage}%)`;
        }
      },
    },
  }));

  series.push({
    type: "pie",
    radius: ["15%", "25%"], // Make the pie chart smaller
    center: ["20%", "20%"], // Move it slightly to the left and up
    data: pieData,
    tooltip: {
      show: false,
      splitLine: {
        show: true, // Show horizontal grid lines
      },
    },
    textStyle: {
      align: "left", // Align text to the left
    },
    label: {
      show: false,
      position: "inside",
      emphasis: {
        show: true,
        formatter: "{b}: {c} ({d}%)",
        fontSize: 12,
        fontWeight: "bold",
      },
    },
  });

  for (const teamId in teamHands) {
    const color = teamColors[teamId]
      ? `rgb(${teamColors[teamId].color_red}, ${teamColors[teamId].color_green}, ${teamColors[teamId].color_blue})`
      : "black"; // Default color if no color is found

    const scores = teamHands[teamId].map((round: any) => ({
      value: round.SCORE + 500,
      name: round,
      itemStyle: {
        color: round.IS_WINNER ? "white" : undefined,
        borderColor: color, // Use line color
        borderWidth: round.IS_WINNER ? 4 : undefined,
        fontWeight: "bold", // Make the text bold
      },
    }));

    series.push({
      data: scores,
      type: "line",
      name: teamId,
      lineStyle: {
        color: color,
        width: 8, // Adjust the line thickness
      },
      smooth: true, // Ensure smoothing is enabled
      symbol: "circle",
      symbolSize: (value: any, params: any) =>
        params.data.name.IS_WINNER ? 20 : 0, // Make the circles larger
      label: {
        show: true,
        position: "right",
        formatter: (params: any) => {
          if (params.dataIndex === scores.length - 1) {
            return `${params.value} ${getTeamName(teamId)}`;
          }
          return "";
        },
        color: color,
        fontSize: 16, // Larger font size
        textBorderColor: "white", // White border around text
        textBorderWidth: 2, // Border width
      },
    });
  }

  series.push({
    data: rounds.map(() => 500),
    type: "line",
    name: "Threshold",
    lineStyle: {
      color: "gray",
      type: "dashed",
      splitLine: {
        show: true, // Show horizontal grid lines
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true, // Show grid lines for y-axis
      },
    },
    symbol: "none",
    label: {
      show: false,
    },
  });
  console.log("Series data:", series);

  const options = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        if (params.some((param: any) => param.seriesType === "pie")) {
          return ""; // Hide tooltip when hovering over pie chart
        }
        return params
          .map((param: any) => {
            const teamName = getTeamName(param.seriesName);
            if (teamName !== "Unknown Team") {
              const windHand = param.data.name.WIND;
              const hand = param.data.name.HAND + "p";
              const handScore = param.data.name.HAND_SCORE;
              const formattedHandScore =
                handScore > 0 ? `+${handScore}` : handScore;
              const isWinner = param.data.name.IS_WINNER;
              const mahjongText = isWinner ? " mahjong" : "";
              const color = teamColors[param.seriesName]
                ? `rgb(${teamColors[param.seriesName].color_red}, ${
                    teamColors[param.seriesName].color_green
                  }, ${teamColors[param.seriesName].color_blue})`
                : "black";
              return `<span style="display:inline-block;width:10px;height:10px;background-color:${color};margin-right:5px;"></span>${teamName}: ${
                param.value - 500
              } (${windHand} ${hand}${mahjongText}, ${formattedHandScore})`;
            }
            return null;
          })
          .filter((text: any) => text !== null)
          .join("<br/>");
      },
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
      data: rounds,
      startValue: 0,
      axisLabel: {
        formatter: (value: string) => {
          const roundNumber = parseInt(value, 10);
          const actualMatchLength = Math.floor(hands.length / 4);
          return roundNumber <= actualMatchLength ? value : "";
        },
      },
    },
    yAxis: {
      type: "value",
      min: (value: any) => {
        const minValue = Math.min(0, Math.floor((value.min - 100) / 100) * 100);
        return minValue;
      },
      max: (value: any) => {
        const minValue = Math.min(0, Math.floor((value.min - 100) / 100) * 100);
        const maxValue = Math.ceil((value.max + 100) / 100) * 100;
        if (maxValue - minValue < 1000) {
          return maxValue + (1000 -  Math.abs(minValue - maxValue));
        }
        return maxValue;
      },
      splitLine: {
        show: true, // Show grid lines for y-axis
      },
      axisLabel: {
        formatter: (value: number) => {
          return value === 500 ? "500" : value.toString();
        },
      },
    },
    series: series,
  };

  if (hands.length === 0) {
    return null; // Hide the graph if no rounds are registered
  }

  return (
    <ReactEcharts
      option={options}
      style={{ height: "600px" }}
    />
  );
}
