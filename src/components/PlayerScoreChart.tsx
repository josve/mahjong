"use client";
import React, { useMemo } from "react";
import PlayerScoresChart from "./PlayerScoreChart/PlayerScoresChart";
import MahjongWinsChart from "./PlayerScoreChart/MahjongWinsChart";
import HighRollerChart from "./PlayerScoreChart/HighRollerChart";
import AverageHanTable from "./PlayerScoreChart/AverageHanTable";

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
        const matchDate: any = new Date(match.TIME).getTime();
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

  return (
    <div>
      <PlayerScoresChart
        playerScores={playerScores}
        labels={labels}
        playerNameToId={Object.fromEntries(
          allPlayers.map((player) => [player.name, player.id])
        )}
        playerColors={playerColors}
      />
      <MahjongWinsChart
        mahjongWins={mahjongWins}
        playerNameToId={Object.fromEntries(
          allPlayers.map((player) => [player.name, player.id])
        )}
        playerColors={playerColors}
      />
      <HighRollerChart
        highRollerScores={highRollerScores}
        playerColors={playerColors}
        playerNameToId={Object.fromEntries(
          allPlayers.map((player) => [player.name, player.id])
        )}
      />
      <AverageHanTable
        averageHan={averageHan}
        playerColors={playerColors}
      />
    </div>
  );
};

export default PlayerScoreChart;
