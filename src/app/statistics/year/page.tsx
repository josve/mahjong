import React from "react";
import StatisticsNav from "@/components/StatisticsNav";
import PlayerScoreChart from "@/components/PlayerScoreChart";
import fetchMatches from "@/lib/fetchMatches";
import {
  getTeamIdToName,
  getAllPlayers,
  getTeamIdToPlayerIds,
} from "@/lib/dbMatch";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function YearStatisticsPage() {
  const matches = await fetchMatches("nuvarande år");
  const teamIdToName = await getTeamIdToName();
  const allPlayers = await getAllPlayers();
  const teamIdToPlayerIds = await getTeamIdToPlayerIds();

  return (
    <div style={{ padding: "20px" }}>
      <StatisticsNav currentPath="/statistics/year" />
      <h1
        style={{
          color: "#943030",
          fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial",
          fontSize: "42px",
        }}
      >
        Statistik - Innevarande år
      </h1>
      <PlayerScoreChart
        matches={matches}
        teamIdToName={teamIdToName}
        allPlayers={allPlayers}
        teamIdToPlayerIds={teamIdToPlayerIds}
      />
    </div>
  );
}
