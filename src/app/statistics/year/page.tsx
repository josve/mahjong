import React from "react";
import StatisticsNav from "@/components/StatisticsNav";
import PlayerScoreChart from "@/components/PlayerScoreChart";
import fetchMatches from "@/lib/fetchMatches";
import {
  getTeamIdToName,
  getAllPlayers,
  getTeamIdToPlayerIds,
  getTeamColors,
} from "@/lib/dbMatch";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Statistik (nuvarande år) - Mahjong Master System",
  };
}

export default async function YearStatisticsPage() {
  const matches = await fetchMatches("nuvarande år");
  const teamIdToName = await getTeamIdToName();
  const allPlayers = await getAllPlayers();
  const teamIdToPlayerIds = await getTeamIdToPlayerIds();
  const teamColors = await getTeamColors();

  return (
    <div>
      <div className="multi-title-header">
        <h1>Statistik - Innevarande år</h1>
        <StatisticsNav currentPath="/statistics/year" />
      </div>
      <PlayerScoreChart
        matches={matches}
        teamIdToName={teamIdToName}
        allPlayers={allPlayers}
        teamIdToPlayerIds={teamIdToPlayerIds}
        teamColors={teamColors}
      />
    </div>
  );
}
