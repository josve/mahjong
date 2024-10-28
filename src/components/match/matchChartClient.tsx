"use client";
import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { CircularProgress } from "@mui/material";
import {capitalize, formatDate} from "@/lib/formatting";

export default function MatchChartClient({
  matchId,
  autoReload,
}: {
  readonly matchId: string;
  readonly autoReload: boolean;
}) {
  const [data, setData] = useState<any>(null);
  const [lastRoundCount, setLastRoundCount] = useState<number>(0);

  const fetchData = async () => {
    const response = await fetch(`/api/matchChart?matchId=${matchId}`);
    const data = await response.json();
    setData(data);
    setLastRoundCount(data.hands.length);
  };

  useEffect(() => {
    fetchData();
  }, [matchId]);

  useEffect(() => {
    if (autoReload) {
      const interval = setInterval(async () => {
        const response = await fetch(`/api/matchChart?matchId=${matchId}`);
        const newData = await response.json();
        if (newData.hands.length > lastRoundCount) {
          setData(newData);
          setLastRoundCount(newData.hands.length);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [autoReload, matchId, lastRoundCount]);

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
    for (const item of teamHand) {
      totalScore += item.HAND_SCORE;
      item.SCORE = totalScore;
    }
  }

  const numRounds = Math.floor(hands.length / 4 - 1);

  const roundsToShow = Math.max(15, numRounds + 5);

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

  // Add no-winner team for rounds with no IS_WINNER
  for (let i = 1; i < numRounds; i++) {
    const roundHands = hands.slice(i * 4, (i + 1) * 4);
    const hasWinner = roundHands.some((hand: any) => hand.IS_WINNER);
    if (!hasWinner) {
      winCounts["no-winner"] = (winCounts["no-winner"] || 0) + 1;
    }
  }

  const totalWins = numRounds;

  const pieData = Object.keys(winCounts).map((teamId) => ({
    value: winCounts[teamId],
    name: teamId === "no-winner" ? "No Winner" : getTeamName(teamId),
    label: {
    	color: teamColors[teamId],
    },
    itemStyle: {
	  borderColor:"white",
	  borderWidth:3,
      color:
        teamId === "no-winner"
          ? "transparent"
          : teamColors[teamId]
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
    radius: ["14%", "22%"],
    center: ["10%", "18%"],
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
      position: "center",
      emphasis: {
        show: true,
        formatter: "{b}: {c} ({d}%)",
        fontSize: 18,
        fontWeight: "bold",
      },
      textBorderWidth: 2,
      textBorderColor: "white",
    },
  });


  series.push({
    data: rounds.map(() => 500),
    type: "line",
    name: "Threshold",
    lineStyle: {
      color: "gray",
      type: [5, 5], //custom dash
      width: 1,
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


  for (const teamId in teamHands) {
    const color = teamColors[teamId]
      ? `rgb(${teamColors[teamId].color_red}, ${teamColors[teamId].color_green}, ${teamColors[teamId].color_blue})`
      : "black"; // Default color if no color is found

    const scores = teamHands[teamId].map((round: any) => ({
      value: round.SCORE + 500,
      name: round,
      itemStyle: {
        color: round.IS_WINNER ? "white" : "transparent",
        borderColor: color, // Use line color
        borderWidth: round.IS_WINNER ? 4 : 0,
        fontWeight: "bold", // Make the text bold
      },
    }));

    series.push({
      data: scores,
      type: "line",
      name: teamId,
      lineStyle: {
        color: color,
        width: 7, // Adjust the line thickness
        cap: "round",
      },
      smooth: 0.4,
      symbol: "circle",
      symbolSize: (value: any, params: any) =>
        params.data.name.IS_WINNER ? 18 : 0, // Make the circles larger
      endLabel: {
        show: true,
        position: "right",
        distance: 18,
        color: color,
        fontSize: 18,
        fontWeight: "bold",
        textBorderWidth: 2,
        textBorderColor: "white",
        formatter: (params: any) => {
          if (params.dataIndex === scores.length - 1) {
            return `${params.value} ${getTeamName(teamId)}`;
          }
        },
      },
    });
  }

  const options = {
    animationDuration: "500",
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        if (params.some((param: any) => param.seriesType === "pie")) {
          return ""; // Hide tooltip when hovering over pie chart
        }

        if (params[0].dataIndex === 0) {
          return "Matchen börjar";
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
                param.value
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
      containLabel: false,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: rounds,
      startValue: 0,
      axisLabel: {
        formatter: (value: string) => {
          const roundNumber = parseInt(value, 10);
          if ((roundNumber - 1) == 0) {
            return "";
          }

          const actualMatchLength = Math.floor(hands.length / 4);
          return roundNumber <= actualMatchLength ? roundNumber - 1 : "";
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
          return value.toString();
        },
      },
    },
    series: series,
  };

  return (
      <>
      <div>
        <div className="multi-title-header">
          <h1>{data?.match?.NAME}</h1>
          <h2 style={{textAlign: "left"}}>{numRounds} omgångar</h2>
        </div>
        <div className="label">
          {capitalize(formatDate(data?.match?.TIME))}
        </div>
        {data?.match?.COMMENT && (
            <div className="label">
              {data?.match?.COMMENT}
            </div>
        )}
      </div>

  <ReactEcharts
      option={options}
      style={{height: "600px"}}
  />
      </>
  );
}
