import React from "react";
import StatisticsNav from "@/components/StatisticsNav";
import PlayerScoreChart from "@/components/PlayerScoreChart";
import fetchMatches from "@/lib/fetchMatches";
import { getTeamIdToName, getAllPlayers } from "@/lib/dbMatch";

export default async function NewStatisticsPage() {
  const matches = await fetchMatches("ny tid");
  const teamIdToName = await getTeamIdToName();
  const allPlayers = await getAllPlayers();

  return (
    <div style={{ padding: "20px" }}>
      <StatisticsNav currentPath="/statistics/new" />
      <h1 style={{ color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        Statistik - Ny tid
      </h1>
      <PlayerScoreChart matches={matches} teamIdToName={teamIdToName} allPlayers={allPlayers} />
      <div style={{ marginTop: "20px" }}>
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.GAME_ID}>
              <p>{match.NAME} - {new Date(match.TIME).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>Inga matcher hittades för det valda tidsintervallet.</p>
        )}
      </div>
    </div>
  );
}
