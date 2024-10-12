import React from "react";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import Connection from "@/lib/connection";

async function fetchMatches(timeRange: string) {
  const connection = await Connection.getInstance().getConnection();
  try {
    let query = "SELECT * FROM Games";
    if (timeRange === "ny tid") {
      query += " WHERE TIME >= '2024-10-01'";
    } else if (timeRange === "nuvarande år") {
      const currentYear = new Date().getFullYear();
      query += ` WHERE YEAR(TIME) = ${currentYear}`;
    }
    const [result] = await connection.query(query);
    return result;
  } finally {
    connection.release();
  }
}

export default async function StatisticsPage() {
  const [timeRange, setTimeRange] = React.useState("ny tid");
  const matches = await fetchMatches(timeRange);
  const [timeRange, setTimeRange] = React.useState("ny tid");

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        Statistik
      </h1>
      <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
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
