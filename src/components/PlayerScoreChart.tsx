"use client";
import React, { useMemo } from "react";
import ReactEcharts from "echarts-for-react";

interface PlayerScoreChartProps {
  matches: any[];
  teamIdToName: { [key: string]: string };
  allPlayers: { id: string; name: string }[];
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
      scores[player.name] = [];
    });

    // Sort matches by date
    const sortedMatches = [...matches].sort((a, b) => new Date(a.TIME).getTime() - new Date(b.TIME).getTime());

    // Calculate scores
    sortedMatches.forEach((match) => {
      const matchDate = new Date(match.TIME).toLocaleDateString();
      labels.push(matchDate);

      // Initialize scores for this match
      allPlayers.forEach(player => {
        scores[player.name].push(scores[player.name].length > 0 ? scores[player.name][scores[player.name].length - 1] : 0);
      });

      match.hands.forEach((hand: any) => {
        const playerIds = teamIdToPlayerIds[hand.TEAM_ID] || [];
        const scorePerPlayer = hand.HAND_SCORE / playerIds.length;

        playerIds.forEach((playerId: string) => {
          const player = allPlayers.find(p => p.id === playerId);
          if (player) {
            scores[player.name][scores[player.name].length - 1] += scorePerPlayer;
          }
        });
      });
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
