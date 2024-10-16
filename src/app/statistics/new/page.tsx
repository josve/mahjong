import React from "react";
import StatisticsNav from "@/components/StatisticsNav";
import PlayerScoreChart from "@/components/PlayerScoreChart";
import fetchMatches from "@/lib/fetchMatches";
import {
  getTeamIdToName,
  getAllPlayers,
  getTeamIdToPlayerIds,
} from "@/lib/dbMatch";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Statistik (ny tid) - Mahjong Master System",
  };
}
export const revalidate = 60; // Revalidate every 60 seconds

export default async function NewStatisticsPage() {
  const matches = await fetchMatches("ny tid");
  const teamIdToName = await getTeamIdToName();
  const allPlayers = await getAllPlayers();
  const teamIdToPlayerIds = await getTeamIdToPlayerIds();

  return (
    <div style={{ padding: "20px" }}>
      <div className="multi-title-header">
        <h1>Statistik - Ny period</h1>
        <StatisticsNav currentPath="/statistics/new" />
      </div>
      <PlayerScoreChart
        matches={matches}
        teamIdToName={teamIdToName}
        allPlayers={allPlayers}
        teamIdToPlayerIds={teamIdToPlayerIds}
      />
    </div>
  );
}
