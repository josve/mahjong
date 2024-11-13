"use client";
import React, { useMemo, useState, useEffect } from "react";
import PlayerScoresChart from "./PlayerScoreChart/PlayerScoresChart";
import MahjongWinsChart from "./PlayerScoreChart/MahjongWinsChart";
import HighRollerChart from "./PlayerScoreChart/HighRollerChart";
import AverageHandTable from "./PlayerScoreChart/AverageHandTable";
import BoxPlot from "./PlayerScoreChart/BoxPlot"
import { Tabs, Tab } from "@mui/material";
import {
    GameWithHands,
    IdToColorMap,
    IdToName,
    PlayerOrTeam,
    SimplePlayer,
    TeamIdToPlayerIds
} from "@/types/db";
import {PeriodType} from "@/types/components";
import {filterGames} from "@/lib/statsFilter";
import {CustomTabPanel} from "@/components/CustomTabPanel";
import {MahjongStats} from "@/lib/statistics";

interface PlayerScoreChartProps {
  matches: GameWithHands[];
  teamIdToName: IdToName;
  allPlayers: SimplePlayer[];
  teamIdToPlayerIds: TeamIdToPlayerIds;
  playerColors: IdToColorMap;
  period: PeriodType;
  allTeamsAndPlayers: PlayerOrTeam[];
  teamAndPlayerColors: IdToColorMap;
}

const PlayerScoreChart: React.FC<PlayerScoreChartProps> = ({
                                                               matches,
                                                               teamIdToPlayerIds,
                                                               period,
                                                               allTeamsAndPlayers,
                                                               teamAndPlayerColors
                                                           }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [filteredMatches, setFilteredMatches] = useState<GameWithHands[]>(matches);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        setFilteredMatches(filterGames(matches, period));
    }, [period, matches]);

    const {stats} =
        useMemo(() => {
            const stats : MahjongStats = new MahjongStats(allTeamsAndPlayers, teamAndPlayerColors, teamIdToPlayerIds);

            // Sort matches by date
            const sortedMatches = [...filteredMatches].sort(
                (a, b) => new Date(a.TIME).getTime() - new Date(b.TIME).getTime()
            );

            // Add games
            sortedMatches.forEach((match, gameIndex) => {
                stats.addGame(match, gameIndex);
            });

            stats.finish();

            return {stats};
        }, [filteredMatches, teamIdToPlayerIds, allTeamsAndPlayers, teamAndPlayerColors]);

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
                    stats={stats}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={1}>
                <MahjongWinsChart
                    stats={stats}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={2}>
                <HighRollerChart
                    stats={stats}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={3}>
                <AverageHandTable
                    stats={stats}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={4}>
                <BoxPlot
                    stats={stats}
                />
            </CustomTabPanel>
        </div>
    );
};

export default PlayerScoreChart;
