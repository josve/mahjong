"use client";
import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress } from "@mui/material";

export default function MatchChartClient({ matchId }: { matchId: string }) {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const response = await fetch(`/api/matchChart?matchId=${matchId}`);
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, [matchId]);

  if (!data) {
    return <CircularProgress />;
  }

  const { hands, teamIdToName, teamColors } = data;

  // Get the hands for each team
  const teamHands = hands.reduce((acc: any, hand: any) => {
    acc[hand.TEAM_ID] = acc[hand.TEAM_ID] || [];
    acc[hand.TEAM_ID].push(hand);
    return acc;
  }, {});

  // For each team, sum the HAND_SCORE for each round and add to the hands objects
  for (const teamId in teamHands) {
    const teamHand = teamHands[teamId];
    let totalScore = 0;
    for (let i = 0; i < teamHand.length; i++) {
      totalScore += teamHand[i].HAND_SCORE;
      teamHand[i].SCORE = totalScore;
    }
  }

  const numRounds = Math.floor(hands.length / 4 - 1);

  const roundsToShow = Math.max(19, numRounds + 7);

  // Initialize rounds starting from 1
  const rounds = Array.from({ length: roundsToShow }, (_, i) =>
    (i + 1).toString()
  );

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
    radius: ["12%", "20%"],
    center: ["90%", "20%"],
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
      endLabel: {
        show: true,
        position: "right",
        color: color,
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "white",
        textBorderColor: "white",
        formatter: (params: any) => {
          if (params.dataIndex === scores.length - 1) {
            return `${params.value} ${getTeamName(teamId)}`;
          }
        },
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
    animationDuration: "500",
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
          return maxValue + (1000 - Math.abs(minValue - maxValue));
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

  return (
    <ReactEcharts
      option={options}
      style={{ height: "600px" }}
    />
  );
}
