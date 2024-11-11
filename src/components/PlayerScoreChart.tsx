"use client";
import React, { useMemo, useState, useEffect } from "react";
import PlayerScoresChart from "./PlayerScoreChart/PlayerScoresChart";
import MahjongWinsChart from "./PlayerScoreChart/MahjongWinsChart";
import HighRollerChart from "./PlayerScoreChart/HighRollerChart";
import AverageHandTable from "./PlayerScoreChart/AverageHandTable";
import BoxPlot from "./PlayerScoreChart/BoxPlot"
import { Tabs, Tab, Box } from "@mui/material";
import {GameWithHands, Hand, IdToColorMap, IdToName, SimplePlayer, TeamIdToPlayerIds} from "@/types/db";
import {HighRollerInfo, IdToNumber, IdToNumbers, PeriodType} from "@/types/components";
import {filterGames} from "@/lib/statsFilter";

interface PlayerScoreChartProps {
  matches: GameWithHands[];
  teamIdToName: IdToName;
  allPlayers: SimplePlayer[];
  teamIdToPlayerIds: TeamIdToPlayerIds;
  playerColors: IdToColorMap;
  period: PeriodType;
}

const CustomTabPanel = (props: { value: number; index: number; children: React.ReactNode }) => {
  const { value, index, children } = props;
  return (
    <div role="tabpanel" hidden={value !== index} style={{ paddingTop: "15px" }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const PlayerScoreChart: React.FC<PlayerScoreChartProps> = ({
  matches,
  teamIdToName,
  allPlayers,
  teamIdToPlayerIds,
  playerColors,
  period,
}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [filteredMatches, setFilteredMatches] = useState<GameWithHands[]>(matches);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        setFilteredMatches(filterGames(matches, period));
    }, [period, matches]);

    const {playerScores, labels, mahjongWins, highRollerScores, averageHand, standardDeviations, allHands, allHandsNoTeams, allScores, allScoresNoTeams} =
        useMemo(() => {
            const scores: IdToNumbers = {};
            const labels: string[] = [];
            const wins: IdToNumber = {};
            const highRollerScores: HighRollerInfo = {};
            const totalHan: IdToNumber= {};
            const handCount: IdToNumber = {};
            const standardDeviations: IdToNumber = {};
            const allHands: IdToNumbers = {};
            const allHandsNoTeams: IdToNumbers = {};
            const allScores: IdToNumbers = {};
            const allScoresNoTeams: IdToNumbers = {};

            let highRollerIndex = 0;

            // Initialize scores, wins, highRollerScores, totalHan, and winCount for all players
            allPlayers.forEach((player) => {
                scores[player.name] = [];
                wins[player.name] = 0;
                highRollerScores[player.name] = [];
                totalHan[player.name] = 0;
                handCount[player.name] = 0;
                standardDeviations[player.name] = 0;
                allHands[player.name] = [];
                allHandsNoTeams[player.name] = [];
                allScores[player.name] = [];
                allScoresNoTeams[player.name] = [];
            });

            // Sort matches by date
            const sortedMatches = [...filteredMatches].sort(
                (a, b) => new Date(a.TIME).getTime() - new Date(b.TIME).getTime()
            );

            // Calculate scores, Mahjong wins, high roller scores, and average han
            sortedMatches.forEach((match, gameIndex) => {
                const matchDate: Date = new Date(match.TIME);
                const label = `${matchDate.getFullYear()}-${(matchDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${matchDate.getDate().toString().padStart(2, "0")}`;
                labels.push(label);

                // Initialize scores for this match
                allPlayers.forEach((player) => {
                    scores[player.name].push(
                        scores[player.name].length > 0
                            ? scores[player.name][scores[player.name].length - 1]
                            : 0
                    );
                });

                match.hands.forEach((hand: Hand) => {
                    const playerIds = teamIdToPlayerIds[hand.TEAM_ID]!;
                    const scorePerPlayer = hand.HAND_SCORE / playerIds.length;
                    playerIds.forEach((playerId: string) => {
                        const player = allPlayers.find((p) => p.id === playerId)!;
                        scores[player.name][scores[player.name].length - 1] += scorePerPlayer;
                        if (hand.IS_WINNER) {
                            wins[player.name]++;
                            totalHan[player.name] += hand.HAND;
                        }
                        allHands[player.name].push(hand.HAND);
                        allScores[player.name].push(hand.HAND_SCORE);
                        if (playerIds.length == 1) {
                            allHandsNoTeams[player.name].push(hand.HAND);
                            allScoresNoTeams[player.name].push(hand.HAND_SCORE);
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
                allHands,
                allHandsNoTeams,
                allScores,
                allScoresNoTeams
            };
        }, [filteredMatches, teamIdToName, allPlayers, teamIdToPlayerIds]);

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
            <Tabs value={selectedTab}
                  variant="scrollable"
                  scrollButtons="auto"
                  onChange={handleTabChange}>
                <Tab label="Poäng" />
                <Tab label="Mahjong" />
                <Tab label="High Roller" />
                <Tab label="Medelhänder" />
                <Tab label="Distribution" />
            </Tabs>
            <CustomTabPanel value={selectedTab} index={0}>
                <PlayerScoresChart
                    playerScores={playerScores}
                    labels={labels}
                    getPlayerColor={getPlayerColor}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={1}>
                <MahjongWinsChart
                    mahjongWins={mahjongWins}
                    getPlayerColor={getPlayerColor}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={2}>
                <HighRollerChart
                    highRollerScores={highRollerScores}
                    getPlayerColor={getPlayerColor}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={3}>
                <AverageHandTable
                    averageHand={averageHand}
                    getPlayerColor={getPlayerColor}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={4}>
                <BoxPlot
                    allHands={allHands}
                    allHandsNoTeams={allHandsNoTeams}
                    allScores={allScores}
                    allScoresNoTeams={allScoresNoTeams}
                    getPlayerColor={getPlayerColor}
                />
            </CustomTabPanel>
        </div>
    );
};

export default PlayerScoreChart;
