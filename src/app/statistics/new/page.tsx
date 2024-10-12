import React from "react";
import StatisticsNav from "@/components/StatisticsNav";
import fetchMatches from "@/lib/fetchMatches";

export default async function NewStatisticsPage() {
  const matches = await fetchMatches("ny tid");

  return (
    <div style={{ padding: "20px" }}>
      <StatisticsNav currentPath="/statistics/new" />
      <h1 style={{ color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        Statistik - Ny tid
      </h1>
      <div>
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
