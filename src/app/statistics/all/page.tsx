import React from "react";
import StatisticsNav from "@/components/StatisticsNav";
import PlayerScoreChart from "@/components/PlayerScoreChart";
import fetchMatches from "@/lib/fetchMatches";
import { getTeamIdToName } from "@/lib/dbMatch";

export default async function AllStatisticsPage() {
  const matches = await fetchMatches("all tid");
  const teamIdToName = await getTeamIdToName();

  return (
    <div style={{ padding: "20px" }}>
      <StatisticsNav currentPath="/statistics/all" />
      <h1 style={{ color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        Statistik - All tid
      </h1>
      <PlayerScoreChart matches={matches} teamIdToName={teamIdToName} />
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
