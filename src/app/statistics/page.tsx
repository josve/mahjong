import React from "react";
import {StatisticsResponse} from "@/types/api";
import {fetchAllTeamsAndPlayers, getTeamAndPlayerColors, getTeamIdToName, getTeamIdToPlayerIds} from "@/lib/dbMatch";
import fetchMatches from "@/lib/fetchMatches";
import StatisticsPageClient from "@/components/statistics/StatisticsPageClient";

export const revalidate = 60;

export default async function StatisticsPage() {
    const teamIdToName = await getTeamIdToName();
    const teamIdToPlayerIds = await getTeamIdToPlayerIds();
    const matches = await fetchMatches();
    const allTeamsAndPlayers = await fetchAllTeamsAndPlayers();
    const teamAndPlayerColors = await getTeamAndPlayerColors();

    const data: StatisticsResponse = {
        allTeamsAndPlayers,
        teamIdToName,
        teamIdToPlayerIds,
        teamAndPlayerColors,
        matches
    };
    return (
        <StatisticsPageClient data={data}/>
    );
}
