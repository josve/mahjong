"use client";
import React from "react";
import { getPlayersForTeam } from "@/lib/dbMatch";
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

  const fetchPlayerScores = async () => {
    for (const [index, match] of matches.entries()) {
      labels.push(`Game ${index + 1}`);

      for (const hand of match.hands) {
        const players = await getPlayersForTeam(hand.TEAM_ID);
        const score = hand.HAND_SCORE / players.length;

        players.forEach((player: any) => {
          if (!playerScores[player.NAME]) {
            playerScores[player.NAME] = [];
          }

          const previousScore = playerScores[player.NAME][index - 1] || 0;
          playerScores[player.NAME][index] = previousScore + score;
        });
      }
    }
  };

  fetchPlayerScores();

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
