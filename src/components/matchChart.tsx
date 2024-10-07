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

  // Calculate the percentage of wins for each player
  const winCounts = hands.reduce((acc: any, hand: any) => {
    if (hand.IS_WINNER) {
      acc[hand.TEAM_ID] = (acc[hand.TEAM_ID] || 0) + 1;
    }
    return acc;
  }, {});

  const totalWins = Object.values(winCounts).reduce((sum: number, count: number) => sum + count, 0);

  const pieData = Object.keys(winCounts).map((teamId) => ({
    value: winCounts[teamId],
    name: getTeamName(teamId),
    itemStyle: {
      color: teamColors[teamId]
        ? `rgb(${teamColors[teamId].color_red}, ${teamColors[teamId].color_green}, ${teamColors[teamId].color_blue})`
        : 'transparent', // Use transparent if no color is found
    },
    height: 800, // Make the chart twice as high
  }));

  series.push({
    type: 'pie',
    radius: ['21%', '35%'], // Reduce size by 30%
    center: ['15%', '25%'], // Move 20px further down
    data: pieData,
    label: {
      show: false, // Remove labels
    },
  });

  for (const teamId in teamHands) {
    const color = teamColors[teamId]
      ? `rgb(${teamColors[teamId].color_red}, ${teamColors[teamId].color_green}, ${teamColors[teamId].color_blue})`
      : 'black'; // Default color if no color is found

    const scores = teamHands[teamId].map((round: any) => ({
      value: round.SCORE + 500,
      name: round,
      itemStyle: {
        color: round.IS_WINNER ? 'white' : undefined,
        borderColor: color, // Use line color
        borderWidth: round.IS_WINNER ? 4 : undefined,
        fontWeight: 'bold', // Make the text bold
      },
    }));

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
      startValue: 0,
    },
    yAxis: {
      type: "value",
    },
    series: series,
  };

  return <ReactEcharts option={options} style={{ height: "600px" }} />;
}
