import React from "react";
import StatisticsNav from "@/components/StatisticsNav";
import PlayerScoreChart from "@/components/PlayerScoreChart";
import fetchMatches from "@/lib/fetchMatches";
import {
  getTeamIdToName,
  getAllPlayers,
  getTeamIdToPlayerIds,
  getTeamColors,
  getPlayerColors,
} from "@/lib/dbMatch";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Statistik (all tid) - Mahjong Master System",
  };
}

export default async function AllStatisticsPage() {
  const matches = await fetchMatches("all tid");
  const teamIdToName = await getTeamIdToName();
  const allPlayers: { id: string; name: string }[] = await getAllPlayers();
  const teamIdToPlayerIds = await getTeamIdToPlayerIds();
  const teamColors = await getTeamColors();
  const playerColors = await getPlayerColors();

  return (
    <div>
      <div className="multi-title-header">
        <h1>Statistik - All tid</h1>
        <StatisticsNav currentPath="/statistics/all" />
      </div>
      <PlayerScoreChart
        matches={matches}
        teamIdToName={teamIdToName}
        allPlayers={allPlayers}
        teamIdToPlayerIds={teamIdToPlayerIds}
        teamColors={teamColors}
        playerColors={playerColors}
      />
    </div>
  );
}
