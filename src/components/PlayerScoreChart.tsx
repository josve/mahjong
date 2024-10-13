"use client";
import React, { useMemo } from "react";
import ReactEcharts from "echarts-for-react";

interface PlayerScoreChartProps {
  matches: any[];
  teamIdToName: { [key: string]: string };
  allPlayers: string[];
  teamIdToPlayerIds: { [key: string]: string[] };
}

const PlayerScoreChart: React.FC<PlayerScoreChartProps> = ({ matches, teamIdToName, allPlayers, teamIdToPlayerIds }) => {
  console.log('allPlayers:', allPlayers);
  console.log('teamIdToPlayerIds:', teamIdToPlayerIds);

  const { playerScores, labels } = useMemo(() => {
    const scores: { [key: string]: number[] } = {};
    const labels: string[] = [];

    // Initialize scores for all players
    allPlayers.forEach(player => {
      scores[player] = new Array(matches.length).fill(0);
    });

    // Calculate scores
    matches.forEach((match, index) => {
      labels.push(`Game ${index + 1}`);
      match.hands.forEach((hand: any) => {
        const playerIds = teamIdToPlayerIds[hand.TEAM_ID] || [];
        const scorePerPlayer = hand.HAND_SCORE / playerIds.length;

        playerIds.forEach((playerId: string) => {
          const player = allPlayers.find(p => p === playerId);
          if (player) {
            scores[player][index] += scorePerPlayer;
          }
        });
      });
    });

    // Calculate cumulative scores
    Object.keys(scores).forEach((player) => {
      for (let i = 1; i < scores[player].length; i++) {
        scores[player][i] += scores[player][i - 1];
      }
    });

    return { playerScores: scores, labels };
  }, [matches, teamIdToName, allPlayers, teamIdToPlayerIds]);

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
