"use client";
import React, { useMemo } from "react";
import PlayerScoresChart from "./PlayerScoreChart/PlayerScoresChart";
import MahjongWinsChart from "./PlayerScoreChart/MahjongWinsChart";
import HighRollerChart from "./PlayerScoreChart/HighRollerChart";
import AverageHandTable from "./PlayerScoreChart/AverageHandTable";
import StandardDeviationChart from "./PlayerScoreChart/StandardDeviationChart"; // Import the new chart component

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
    const {playerScores, labels, mahjongWins, highRollerScores, averageHand, standardDeviations} =
        useMemo(() => {
            const scores: { [key: string]: number[] } = {};
            const labels: string[] = [];
            const wins: { [key: string]: number } = {};
            const highRollerScores: { [key: string]: [number, number, number, boolean][] } = {}; // [gameIndex, score]
            const totalHan: { [key: string]: number } = {};
            const handCount: { [key: string]: number } = {};
            const standardDeviations: { [key: string]: number } = {};

            let highRollerIndex = 0;

            // Initialize scores, wins, highRollerScores, totalHan, and winCount for all players
            allPlayers.forEach((player) => {
                scores[player.name] = [];
                wins[player.name] = 0;
                highRollerScores[player.name] = [];
                totalHan[player.name] = 0;
                handCount[player.name] = 0;
                standardDeviations[player.name] = 0;
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
                    const playerIds = teamIdToPlayerIds[hand.TEAM_ID]!;
                    const scorePerPlayer = hand.HAND_SCORE / playerIds.length;
                    playerIds.forEach((playerId: string) => {
                        const player = allPlayers.find((p) => p.id === playerId)!;
                        scores[player.name][scores[player.name].length - 1] += scorePerPlayer;
                        if (hand.IS_WINNER) {
                            wins[player.name]++;
                            totalHan[player.name] += hand.HAND;
                        }
                        handCount[player.name] += 1;
                        if (hand.HAND > 100) {
                            highRollerScores[player.name].push([gameIndex, hand.HAND, highRollerIndex++, playerIds.length > 1]);
                        }
                    });
                });

                // Calculate standard deviation for each player
                allPlayers.forEach((player) => {
                    const playerScores = scores[player.name];
                    const mean = playerScores.reduce((acc, score) => acc + score, 0) / playerScores.length;
                    const squaredDifferences = playerScores.map(score => Math.pow(score - mean, 2));
                    const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / squaredDifferences.length;
                    standardDeviations[player.name] = Math.sqrt(variance);
                });
            });

            // Calculate average han for each player
            const averageHand: { [key: string]: number } = {};
            Object.keys(totalHan).forEach((player) => {
                averageHand[player] =
                    handCount[player] > 0 ? totalHan[player] / handCount[player] : 0;
            });

            return {
                playerScores: scores,
                labels,
                mahjongWins: wins,
                highRollerScores,
                averageHand,
                standardDeviations,
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
            : "black";
    };

    return (
        <div>
            <PlayerScoresChart
                playerScores={playerScores}
                labels={labels}
                getPlayerColor={getPlayerColor}
            />
            <MahjongWinsChart
                mahjongWins={mahjongWins}
                getPlayerColor={getPlayerColor}
            />
            <HighRollerChart
                highRollerScores={highRollerScores}
                getPlayerColor={getPlayerColor}
            />
            <AverageHandTable
                averageHand={averageHand}
                getPlayerColor={getPlayerColor}
            />
            <StandardDeviationChart
                standardDeviations={standardDeviations}
                getPlayerColor={getPlayerColor}
            />
        </div>
    );
};

export default PlayerScoreChart;
