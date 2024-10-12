"use client";
import React from "react";
import ReactEcharts from "echarts-for-react";

interface PlayerScoreChartProps {
  matches: any[];
  teamIdToName: { [key: string]: string };
}

const PlayerScoreChart: React.FC<PlayerScoreChartProps> = ({
  matches,
  teamIdToName,
}) => {
  const playerScores: { [key: string]: number[] } = {};
  const labels: string[] = [];

  matches.forEach((match, index) => {
    labels.push(`Game ${index + 1}`);

    match.hands.forEach((hand: any) => {
      const playerNames = teamIdToName[hand.TEAM_ID].split('+');
      const score = hand.HAND_SCORE / playerNames.length;

      playerNames.forEach((playerName: string) => {
        if (!playerScores[playerName]) {
          playerScores[playerName] = [];
        }

        const previousScore = playerScores[playerName][index - 1] || 0;
        playerScores[playerName][index] = previousScore + score;
      });
    });
  });

  const series = Object.entries(playerScores).map(([player, scores]) => ({
    name: player,
    type: "line",
    data: scores,
    smooth: true,
    lineStyle: {
      width: 2,
    },
  }));

  const options = {
    title: {
      text: "Player Scores Over Games",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: Object.keys(playerScores),
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
      data: labels,
    },
    yAxis: {
      type: "value",
    },
    series: series,
  };

  return <ReactEcharts option={options} style={{ height: "400px" }} />;
};

export default PlayerScoreChart;
