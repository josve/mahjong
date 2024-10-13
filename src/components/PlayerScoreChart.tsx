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
  const { playerScores, labels, mahjongWins } = useMemo(() => {
    const scores: { [key: string]: number[] } = {};
    const labels: string[] = [];
    const wins: { [key: string]: number } = {};

    // Initialize scores and wins for all players
    allPlayers.forEach(player => {
      scores[player.name] = [];
      wins[player.name] = 0;
    });

    // Sort matches by date
    const sortedMatches = [...matches].sort((a, b) => new Date(a.TIME).getTime() - new Date(b.TIME).getTime());

    // Calculate scores and Mahjong wins
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
            if (hand.IS_WINNER) {
              wins[player.name]++;
            }
          }
        });
      });
    });

    return { playerScores: scores, labels, mahjongWins: wins };
  }, [matches, teamIdToName, allPlayers, teamIdToPlayerIds]);

  const scoreSeries = Object.entries(playerScores).map(([player, scores]) => ({
    name: player,
    type: "line",
    data: scores,
    smooth: true,
    lineStyle: {
      width: 2,
    },
  }));

  const scoreOptions = {
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
    series: scoreSeries,
  };

  const winsSeries = Object.entries(mahjongWins).map(([player, wins]) => ({
    name: player,
    value: wins,
  }));

  const winsOptions = {
    title: {
      text: "Total Mahjong Wins per Player",
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Mahjong Wins',
        type: 'pie',
        radius: '50%',
        data: winsSeries,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div>
      <ReactEcharts option={scoreOptions} style={{ height: "400px" }} />
      <ReactEcharts option={winsOptions} style={{ height: "400px" }} />
    </div>
  );
};

export default PlayerScoreChart;
