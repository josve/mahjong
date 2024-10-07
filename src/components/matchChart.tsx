"use client";
import React from "react";
import ReactEcharts from "echarts-for-react";

export default function MatchChart({
  hands,
  teamHands,
  teamIdToName,
}: {
  hands: any[];
  teamHands: any[];
}) {
  // Initialize rounds starting from 1
  const rounds = Array.from({ length: 19 }, (_, i) => (i + 1).toString());

  const getTeamName = (teamId: string) => teamIdToName[teamId] || "Unknown Team";

  let series = [];

  for (const teamId in teamHands) {
    // Initialize scores with zero for round 1
    const scores = [{ value: 0, name: { ROUND: 0, IS_WINNER: 0 } }, ...teamHands[teamId].map((round: any) => ({
      value: round.SCORE,
      name: round,
      itemStyle: {
        color: round.IS_WINNER ? 'white' : undefined,
        borderColor: round.IS_WINNER ? undefined : teamId, // Use line color
        borderWidth: round.IS_WINNER ? 2 : undefined,
      },
    }))];

    const lastRound = teamHands[teamId][teamHands[teamId].length - 1];
    series.push({
      data: scores,
      type: "line",
      name: teamId,
      lineStyle: {
        width: 6, // Make the line way thicker
      },
      smooth: true, // Ensure smoothing is enabled
      symbol: 'circle',
      symbolSize: (value: any, params: any) => (params.data.name.IS_WINNER ? 10 : 0),
      label: {
        show: true,
        position: 'right',
        formatter: (params: any) => {
          if (params.dataIndex === scores.length - 1) {
            return `${params.value} - ${getTeamName(teamId)}`;
          }
          return '';
        },
        color: lastRound && lastRound.itemStyle ? lastRound.itemStyle.color : 'black',
      },
    });
  }

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
