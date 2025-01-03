"use client";
import React, { useMemo, useState, useEffect } from "react";
import PlayerScoresChart from "./PlayerScoresChart";
import MahjongWinsChart from "./MahjongWinsChart";
import HighRollerChart from "./HighRollerChart";
import AverageHandTable from "./AverageHandTable";
import BoxPlot from "./BoxPlot"
import { Tabs, Tab } from "@mui/material";
import {
    GameWithHands,
    IdToColorMap,
    IdToName,
    PlayerOrTeam,
    TeamIdToPlayerIds
} from "@/types/db";
import {PeriodType} from "@/types/components";
import {filterGames} from "@/lib/statsFilter";
import {CustomTabPanel} from "@/components/CustomTabPanel";
import {MahjongStats} from "@/lib/statistics";

interface PlayerScoreChartProps {
  matches: GameWithHands[];
  teamIdToName: IdToName;
  teamIdToPlayerIds: TeamIdToPlayerIds;
  period: PeriodType;
  allTeamsAndPlayers: PlayerOrTeam[];
  teamAndPlayerColors: IdToColorMap;
  includeTeams: boolean;
}

const PlayerScoreChart: React.FC<PlayerScoreChartProps> = ({
                                                               matches,
                                                               teamIdToPlayerIds,
                                                               period,
                                                               allTeamsAndPlayers,
                                                               teamAndPlayerColors,
                                                               includeTeams
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
        }, [filteredMatches, includeTeams, period, teamIdToPlayerIds, allTeamsAndPlayers, teamAndPlayerColors]);

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
                    includeTeams={includeTeams}
                />
                    </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={1}>
                <MahjongWinsChart
                    stats={stats}
                    includeTeams={includeTeams}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={2}>
                <HighRollerChart
                    stats={stats}
                    includeTeams={includeTeams}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={3}>
                <AverageHandTable
                    stats={stats}
                    includeTeams={includeTeams}
                />
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={4}>
                <BoxPlot
                    stats={stats}
                    includeTeams={includeTeams}
                />
            </CustomTabPanel>
        </div>
    );
};

export default PlayerScoreChart;
