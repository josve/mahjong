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
}) {
  // Initialize rounds starting from 1
  const rounds = Array.from({ length: 19 }, (_, i) => (i + 1).toString());

  const getTeamName = (teamId: string) => {
    if (!teamIdToName) {
      console.error("teamIdToName is undefined");
      return "Unknown Team";
    }
    return teamIdToName[teamId] || "Unknown Team";
  };

  let series = [];

  for (const teamId in teamHands) {
    const color = teamColors[teamId]
      ? `rgb(${teamColors[teamId].color_red}, ${teamColors[teamId].color_green}, ${teamColors[teamId].color_blue})`
      : 'black'; // Default color if no color is found

    // Initialize scores with zero for round 1
    const scores = [{ value: 0, name: { ROUND: 0, IS_WINNER: 0 } }, ...teamHands[teamId].map((round: any) => ({
      value: round.SCORE + 500,
      name: round,
      itemStyle: {
        color: round.IS_WINNER ? 'white' : undefined,
        borderColor: color, // Use line color
        borderWidth: round.IS_WINNER ? 4 : undefined,
        fontWeight: 'bold', // Make the text bold
      },
    }))];

    const lastRound = teamHands[teamId][teamHands[teamId].length - 1];

    series.push({
      data: scores,
      type: "line",
      name: teamId,
      lineStyle: {
        color: color,
        width: 6, // Make the line way thicker
      },
      smooth: true, // Ensure smoothing is enabled
      symbol: 'circle',
      symbolSize: (value: any, params: any) => (params.data.name.IS_WINNER ? 15 : 0),
      label: {
        show: true,
        position: 'right',
        formatter: (params: any) => {
          if (params.dataIndex === scores.length - 1) {
            return `${params.value} ${getTeamName(teamId)}`;
          }
          return '';
        },
        color: color,
        fontSize: 14, // Slightly larger font size
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
    },
    symbol: "none",
    label: {
      show: false,
    },
  });
  console.log("Series data:", series);

  const options = {
    title: {
      text: "Match Chart",
    },
    tooltip: {
      trigger: "axis",
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
      startValue: 1,
    },
    yAxis: {
      type: "value",
    },
    series: series,
  };

  return <ReactEcharts option={options} />;
}
