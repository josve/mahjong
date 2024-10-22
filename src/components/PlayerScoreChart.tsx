"use client";
import React, { useMemo } from "react";
import ReactEcharts from "echarts-for-react";

interface PlayerScoreChartProps {
  matches: any;
  teamIdToName: { [key: string]: string };
  allPlayers: { id: string; name: string }[];
  teamIdToPlayerIds: { [key: string]: string[] };
  playerColors: {
    [key: string]: {
      color_red: number;
      color_green: number;
      color_blue: number;
    };
  };
}

const PlayerScoreChart: React.FC<PlayerScoreChartProps> = ({
  matches,
  teamIdToName,
  allPlayers,
  teamIdToPlayerIds,
  playerColors,
}) => {
  const { playerScores, labels, mahjongWins, highRollerScores, averageHan } =
    useMemo(() => {
      const scores: { [key: string]: number[] } = {};
      const labels: string[] = [];
      const wins: { [key: string]: number } = {};
      const highRollerScores: { [key: string]: [number, number][] } = {}; // [gameIndex, score]
      const totalHan: { [key: string]: number } = {};
      const winCount: { [key: string]: number } = {};

      // Initialize scores, wins, highRollerScores, totalHan, and winCount for all players
      allPlayers.forEach((player) => {
        scores[player.name] = [];
        wins[player.name] = 0;
        highRollerScores[player.name] = [];
        totalHan[player.name] = 0;
        winCount[player.name] = 0;
      });

      // Sort matches by date
      const sortedMatches = [...matches].sort(
        (a, b) => new Date(a.TIME).getTime() - new Date(b.TIME).getTime()
      );

      // Calculate scores, Mahjong wins, high roller scores, and average han
      sortedMatches.forEach((match, gameIndex) => {
        const matchDate = new Date(match.TIME).toLocaleDateString();
        labels.push(matchDate);

        // Initialize scores for this match
        allPlayers.forEach((player) => {
          scores[player.name].push(
            scores[player.name].length > 0
              ? scores[player.name][scores[player.name].length - 1]
              : 0
          );
        });

        match.hands.forEach((hand: any) => {
          const playerIds = teamIdToPlayerIds[hand.TEAM_ID] || [];
          const scorePerPlayer = hand.HAND_SCORE / playerIds.length;

          playerIds.forEach((playerId: string) => {
            const player = allPlayers.find((p) => p.id === playerId);
            if (player) {
              scores[player.name][scores[player.name].length - 1] +=
                scorePerPlayer;
              if (hand.IS_WINNER) {
                wins[player.name]++;
                totalHan[player.name] += hand.HAND;
                winCount[player.name]++;
              }
              if (hand.HAND > 100) {
                highRollerScores[player.name].push([gameIndex, hand.HAND]);
              }
            }
          });
        });
      });

      // Calculate average han for each player
      const averageHan: { [key: string]: number } = {};
      Object.keys(totalHan).forEach((player) => {
        averageHan[player] =
          winCount[player] > 0 ? totalHan[player] / winCount[player] : 0;
      });

      return {
        playerScores: scores,
        labels,
        mahjongWins: wins,
        highRollerScores,
        averageHan,
      };
    }, [matches, teamIdToName, allPlayers, teamIdToPlayerIds]);

  const playerNameToId = Object.fromEntries(
    allPlayers.map((player) => [player.name, player.id])
  );

  const getPlayerColor = (playerName: string) => {
    const playerId = playerNameToId[playerName];
    const playerColor = playerColors[playerId];
    return playerColor
      ? `rgb(${playerColor.color_red}, ${playerColor.color_green}, ${playerColor.color_blue})`
      : undefined;
  };

  const scoreSeries = Object.entries(playerScores).map(([player, scores]) => ({
    name: player,
    type: "line",
    data: scores,
    color: getPlayerColor(player),
    smooth: true,
    lineStyle: {
      width: 2,
      color: getPlayerColor(player),
    },
  }));

  const scoreOptions = {
    title: {
      text: "Spelarpoäng över spel",
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
    itemStyle: {
      color: getPlayerColor(player),
    },
  }));

  const winsOptions = {
    title: {
      text: "Totala Mahjong-vinster per spelare",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Mahjong-vinster",
        type: "pie",
        radius: "50%",
        data: winsSeries,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const highRollerSeries = Object.entries(highRollerScores).map(
    ([player, scores]) => ({
      name: player,
      type: "scatter",
      data: scores.map((score) => [score[0], score[1], player]), // [gameIndex, han, playerName]
      symbolSize: (data: number[]) => (data[1] - 100) / 3 + 10, // Adjust size based on score
      itemStyle: {
        color: getPlayerColor(player),
      },
    })
  );

  const highRollerOptions = {
    title: {
      text: "High Roller-ligan (Händer över 100 han)",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const playerName = params.data[2];
        const gameIndex = params.data[0] + 1; // Add 1 to make it 1-indexed
        const hand = params.data[1];
        return `${playerName}<br/>Spel #${gameIndex}: ${hand} han`;
      },
    },
    grid: {
      left: "5%",
      right: "15%",
      top: "10%",
      bottom: "10%",
    },
    xAxis: {
      type: "value",
      name: "Spelnummer",
      nameLocation: "middle",
      nameGap: 30,
      min: 0,
    },
    yAxis: {
      type: "value",
      name: "Han",
      nameLocation: "middle",
      nameGap: 40,
      min: 100,
    },
    series: highRollerSeries,
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: 20,
      bottom: 20,
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "empty",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "empty",
      },
    ],
  };

  const averageHanSeries = Object.entries(averageHan).map(
    ([player, avgHan]) => ({
      name: player,
      value: avgHan,
      itemStyle: {
        color: getPlayerColor(player),
      },
    })
  );

  const averageHanOptions = {
    title: {
      text: "Genomsnittlig Han per spelare",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: "category",
      data: Object.keys(averageHan),
    },
    series: [
      {
        name: "Genomsnittlig Han",
        type: "bar",
        data: averageHanSeries,
      },
    ],
  };

  return (
    <div>
      <ReactEcharts
        option={scoreOptions}
        style={{ height: "400px" }}
      />
      <ReactEcharts
        option={winsOptions}
        style={{ height: "400px" }}
      />
      <ReactEcharts
        option={highRollerOptions}
        style={{ height: "400px" }}
      />
      <ReactEcharts
        option={averageHanOptions}
        style={{ height: "400px" }}
      />
    </div>
  );
};

export default PlayerScoreChart;
