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
  const { playerScores, labels, mahjongWins, highRollerScores } = useMemo(() => {
    const scores: { [key: string]: number[] } = {};
    const labels: string[] = [];
    const wins: { [key: string]: number } = {};
    const highRollerScores: { [key: string]: [number, number][] } = {}; // [gameIndex, score]

    // Initialize scores, wins, and highRollerScores for all players
    allPlayers.forEach(player => {
      scores[player.name] = [];
      wins[player.name] = 0;
      highRollerScores[player.name] = [];
    });

    // Sort matches by date
    const sortedMatches = [...matches].sort((a, b) => new Date(a.TIME).getTime() - new Date(b.TIME).getTime());

    // Calculate scores, Mahjong wins, and high roller scores
    sortedMatches.forEach((match, gameIndex) => {
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
            if (hand.HAND > 100) {
              highRollerScores[player.name].push([gameIndex, hand.HAND]);
            }
          }
        });
      });
    });

    return { playerScores: scores, labels, mahjongWins: wins, highRollerScores };
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

  const highRollerSeries = Object.entries(highRollerScores).map(([player, scores]) => ({
    name: player,
    type: 'scatter',
    data: scores.map(score => [score[0], score[1], player]), // [gameIndex, han, playerName]
    symbolSize: (data: number[]) => (data[1] - 100) / 3 + 10, // Adjust size based on score
  }));

  const highRollerOptions = {
    title: {
      text: "High Roller-ligan (Hands over 100 han)",
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const playerName = params.data[2];
        const gameIndex = params.data[0] + 1; // Add 1 to make it 1-indexed
        const hand = params.data[1];
        return `${playerName}<br/>Game #${gameIndex}: ${hand} han`;
      }
    },
    grid: {
      left: '5%',
      right: '15%',
      top: '10%',
      bottom: '10%',
    },
    xAxis: {
      type: 'value',
      name: 'Game Number',
      nameLocation: 'middle',
      nameGap: 30,
      min: 0,
    },
    yAxis: {
      type: 'value',
      name: 'Han',
      nameLocation: 'middle',
      nameGap: 40,
      min: 100,
    },
    series: highRollerSeries,
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'empty'
      }
    ],
  };

  return (
    <div>
      <ReactEcharts option={scoreOptions} style={{ height: "400px" }} />
      <ReactEcharts option={winsOptions} style={{ height: "400px" }} />
      <ReactEcharts option={highRollerOptions} style={{ height: "400px" }} />
    </div>
  );
};

export default PlayerScoreChart;
