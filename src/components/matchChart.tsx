"use client";
import React from "react";
import ReactEcharts from "echarts-for-react";

export default function MatchChart({
  hands,
  teamHands,
}: {
  hands: any[];
  teamHands: any[];
}) {
  // Find all unique rounds and sort them
  const rounds = Array.from(new Set(hands.map((hand) => hand.ROUND + 1))).sort(
    (a, b) => Number(a) - Number(b)
  );

  // If less than 19 rounds add the missing rounds with null values to rounds.
  if (rounds.length < 19) {
    for (let i = rounds.length; i < 19; i++) {
      rounds.push("");
    }
  }

  let series = [];

  for (const teamId in teamHands) {
    series.push({
      data: teamHands[teamId].map((round: any) => ({
        value: round.SCORE,
        name: round,
        itemStyle: {
          color: round.WINNER ? 'white' : undefined,
          borderColor: round.WINNER ? 'black' : undefined,
          borderWidth: round.WINNER ? 2 : undefined,
        },
      })),
      type: "line",
      name: teamId,
      lineStyle: {
        width: 3, // Thicker line
        smooth: true, // Enable smoothing
      },
      symbol: 'circle',
      symbolSize: (value: any, params: any) => (params.data.name.WINNER ? 10 : 0),
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
